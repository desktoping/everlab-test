export type Condition = {
  name: string;
  diagnostic_metrics: string;
};

export type DiagnosticGroup = {
  name: string;
  diagnostics: string;
  diagnostic_metrics: string;
};

export type DiagnosticMetric = {
  name: string;
  oru_sonic_codes: string;
  diagnostic: string;
  diagnostic_groups: string;
  oru_sonic_units: string;
  units: string;
  min_age: number;
  max_age: number;
  gender: string;
  standard_lower: number;
  standard_higher: number;
  everlab_lower: number;
  everlab_higher: number;
};

export type Diagnostic = {
  name: string;
  diagnostic_groups: string;
  diagnostic_metrics: string;
};

export type Data = {
  conditions: Condition[];
  diagnostic_groups: DiagnosticGroup[];
  diagnostic_metrics: DiagnosticMetric[];
  diagnostics: Diagnostic[];
};
