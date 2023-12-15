import { Box, Typography } from '@mui/material';
import { TResult } from './type';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

type ResultProps = TResult;

const Result = ({ patient, result }: ResultProps) => {
  return (
    <Box sx={{ display: 'flex', gap: '1em', flexDirection: 'column' }}>
      <Typography>
        Patient Name: {patient.firstName} {patient.lastName}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Conducted Test</TableCell>
              <TableCell align="right">Test Result</TableCell>
              <TableCell>Possible condition</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(result).map((k) => {
              const row = result[k];
              return (
                <TableRow key={k} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {k}
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                  <TableCell>{row.condition.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Result;
