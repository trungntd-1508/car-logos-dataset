import sharp from "sharp";
import * as fs from "fs";
import { LogosTargetLocation, THUMB_HEIGHT } from "./config";
import BaseClass from "./BaseClass";
import {execSync, exec}  from "child_process";

class ImageOptimizer extends BaseClass {
  originals: string[] = [];
  optimized: string[] = [];
  thumbs: string[] = [];

  optimizeOpts = {
    quality: 50,
    compressionLevel: 5,
  } as const;

  resizeOpts = {
    fit: "contain",
    height: THUMB_HEIGHT,
  } as const;

  constructor() {
    super();
    this.loadOriginals();
  }

  protected loadOriginals() {
    const dirContent = fs.readdirSync(LogosTargetLocation.Original);

    this.originals = dirContent.filter(
      (path) => !!this.getFileExtFromPath(path)
    );
  }

  protected async optimizeImages() {
    for (const logo of this.originals) {
      const [name] = logo.split(".");
      const targetFile = `${name}.png`;

      try {
        await sharp(`${LogosTargetLocation.Original}/${logo}`)
          .unflatten()
          .png(this.optimizeOpts)
          .toFile(`${LogosTargetLocation.Optimized}/${targetFile}`);
        await exec(`convert ${LogosTargetLocation.Original}/${logo} -fuzz 20% -transparent white ${LogosTargetLocation.Optimized}/${targetFile}`);
        
        

        this.optimized.push(targetFile);

        // await sharp(`${LogosTargetLocation.Original}/${logo}`)
        //   .ensureAlpha()
        //   .raw()
        //   .toBuffer({ resolveWithObject: true })
        //   .then(async ({ data, info }) => {
        //     const { width, height, channels } = info;
        //     for (let i = 0; i < data.length; i += channels) {
        //       if (data[i] == 255 && data[i + 1] == 255 && data[i + 2] == 255) {
        //         data[i] = 0;
        //         data[i + 1] = 0;
        //         data[i + 2] = 0;
        //         data[i + 3] = 0;
        //       }
        //     }
        //     await sharp(data, { raw: { width, height, channels } })
        //       .png(this.optimizeOpts)
        //       .toFile(`${LogosTargetLocation.Optimized}/${targetFile}`);
        //     this.optimized.push(targetFile);
        //   });
      } catch (e) {
        console.error(e);
      }
    }

    console.log("Original images optimized.");
  }

  protected async makeThumbs() {
    for (const logo of this.optimized) {
      // already contains extension
      const targetFile = logo;

      try {
        await sharp(`${LogosTargetLocation.Optimized}/${logo}`)
          .png(this.optimizeOpts)
          .resize(this.resizeOpts)
          .toFile(`${LogosTargetLocation.Thumbs}/${targetFile}`);
        await exec(`convert ${LogosTargetLocation.Thumbs}/${targetFile} -fuzz 20% -transparent white ${LogosTargetLocation.Thumbs}/${targetFile}`);

        // await sharp(`${LogosTargetLocation.Optimized}/${logo}`)
        //   .ensureAlpha()
        //   .raw()
        //   .toBuffer({ resolveWithObject: true })
        //   .then(async ({ data, info }) => {
        //     const { width, height, channels } = info;
        //     for (let i = 0; i < data.length; i += channels) {
        //       if (data[i] == 255 && data[i + 1] == 255 && data[i + 2] == 255) {
        //         data[i] = 0;
        //         data[i + 1] = 0;
        //         data[i + 2] = 0;
        //         data[i + 3] = 0;
        //       }
        //     }
        //     await sharp(data, { raw: { width, height, channels } })
        //       .png(this.optimizeOpts)
        //       .resize(this.resizeOpts)
        //       .toFile(`${LogosTargetLocation.Thumbs}/${targetFile}`);
        //     this.thumbs.push(targetFile);
        //   });

      } catch (e) {
        console.error(e);
      }
    }

    console.log("Thumbnails created.");
  }

  public async run() {
    try {
      console.log("Started image processing.");

      await this.optimizeImages();
      await this.makeThumbs();

      console.log("Finished Image processing.");
    } catch (e) {
      console.log(e);
    }

    return {
      originals: this.originals,
      optimized: this.optimized,
      thumbs: this.thumbs,
    };
  }
}

export default ImageOptimizer;
