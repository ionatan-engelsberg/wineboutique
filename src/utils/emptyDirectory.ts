import fs from 'fs';

const routeSource = `${__dirname}/../../uploads`;

export const emptyUploadsDirectory = () => {
  fs.readdir(`${routeSource}`, (err: any, files: any) => {
    // TODO: Better handling of error
    if (err) return console.log(err);
    files.forEach((file) => {
      fs.unlink(`${routeSource}/${file}`, (error) => {
        // TODO: Better handling of error
        if (err) return console.log(error);
      });
    });
  });
};
