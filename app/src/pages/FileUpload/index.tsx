import { CloudUpload } from '@mui/icons-material';
import { Box, styled, Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { TResult } from './type';
import Result from './result';

const PREFIX = 'UPLOAD_COMPONENT';

const classes = {
  root: `${PREFIX}-root`,
  noMouseEvent: `${PREFIX}-no-mouse-event`,
  iconText: `${PREFIX}-icon-text`,
  hidden: `${PREFIX}-hidden`,
  onDragOver: `${PREFIX}-drag-over`,
  visibleContainer: `${PREFIX}-visible-container`,
  resultContainer: `${PREFIX}-result-container`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '3em',
  },
  [`& .${classes.noMouseEvent}`]: {
    pointerEvents: 'none',
  },
  [`& .${classes.iconText}`]: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    color: theme.palette.primary.main,
    width: 800,
    height: 300,
  },
  [`& .${classes.hidden}`]: {
    display: 'none',
  },
  [`& .${classes.onDragOver}`]: {
    '& img': {
      opacity: 0.3,
    },
    '& p, svg': {
      opacity: 1,
    },
  },
  [`& .${classes.visibleContainer}`]: {
    borderRadius: 10,
    width: 800,
    height: 300,
    backgroundColor: '#fff',
  },
  [`& .${classes.resultContainer}`]: {
    width: 800,
    height: 500,
    background: theme.palette.secondary.light,
    color: 'black',
    textAlign: 'left',
    padding: 10,
    overflow: 'auto',
  },
}));

export const FileUpload = () => {
  const hoverLabel = 'Click or drag HL7/ORU file';
  const dropLabel = 'Drop HL7/ORU file here';

  const [labelText, setLabelText] = React.useState<string>(hoverLabel);
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false);
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<TResult | null>(null);

  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const dragEvents = {
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e);
      setIsDragOver(true);
      setLabelText(dropLabel);
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e);
      setIsDragOver(false);
      setLabelText(hoverLabel);
    },
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>) => {
      stopDefaults(e);
      setLabelText(hoverLabel);
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files && files.length) {
        handleFileUpload(files);
      }
    },
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length) {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const { name } = files[0];
    setSelectedFile(name);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const data: TResult = await fetch('http://localhost:80/upload', {
        method: 'POST',
        body: formData,
      }).then((r) => r.json());

      console.log(data);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Root className={classes.root}>
      {!isUploading && (
        <>
          <input
            onChange={handleChange}
            accept={'text/*'}
            // Should match the API
            name="file"
            className={classes.hidden}
            id="file-upload"
            type="file"
            multiple={false}
          />

          <label htmlFor="file-upload" {...dragEvents} className={clsx(isDragOver && classes.onDragOver)}>
            <Box className={clsx(classes.visibleContainer, classes.noMouseEvent)}>
              <Box className={classes.iconText}>
                <CloudUpload fontSize="large" />
                <Typography>{labelText}</Typography>
                {selectedFile && <Typography>{selectedFile}</Typography>}
              </Box>
            </Box>
          </label>
        </>
      )}
      <Box className={classes.resultContainer}>
        <Typography sx={{ marginBottom: 5 }} variant="h3">
          Result:
        </Typography>
        {result && <Result {...result} />}
      </Box>
    </Root>
  );
};
