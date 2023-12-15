import HL7 from "hl7-standard";
import { DiagnosticMetric, Condition, Data } from "./db-types";
import { Low } from "lowdb/lib";
import moment from "moment";

type TestResult = {
  value: string;
  metric: DiagnosticMetric;
  abnormalStandard: boolean;
  abnormalEverlab: boolean;
  condition: Condition;
};

type Result = {
  patient: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
  };
  result: Record<string, TestResult>;
};

export const getResults = (hl7message: string, db: Low<Data>): Result => {
  const hl7 = new HL7(hl7message);
  hl7.transform();

  const dob = hl7.get("PID.7");
  const age = moment().diff(moment(dob, "YYYYMMDD"), "years");
  const gender = hl7.get("PID.8");

  const results = {} as Record<string, TestResult>;

  for (let obx of hl7.getSegments("OBX")) {
    let result = obx.get("OBX.5");
    let resultLabel = result;
    const diagnosticName = obx.get("OBX.3.2");

    // Get diagnostic metric based on oru code, age, and gender
    const metric = db.data.diagnostic_metrics.find(
      (f) =>
        f.oru_sonic_codes.includes(diagnosticName) &&
        f.min_age <= age &&
        f.max_age >= age &&
        ["Any", gender].some((g) => g === f.gender)
    );

    if (typeof result === "object" && "OBX.5.1" in result) {
      result = obx.get("OBX.5.2");
      resultLabel = Object.values(result).join("");
    }

    if (metric) {
      const abnormalEverlab =
        metric.everlab_lower >= result || metric.everlab_higher <= result;

      const abnormalStandard =
        metric.standard_lower >= result || metric.standard_higher <= result;

      if (abnormalEverlab || abnormalStandard) {
        const condition = db.data.conditions.find(
          (c) => c.diagnostic_metrics === metric?.name
        );

        if (condition) {
          results[diagnosticName] = {
            value: resultLabel,
            metric,
            abnormalEverlab,
            abnormalStandard,
            condition,
          };
        }
      }
    }
  }

  const pid = hl7.getSegment("PID");

  return {
    patient: {
      firstName: pid.get("PID.5.1"),
      lastName: pid.get("PID.5.2"),
      age,
      gender,
    },
    result: results,
  };
};
