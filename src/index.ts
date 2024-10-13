import LogoScrapper from "./LogoScrapper";
import ImageOptimizer from "./ImageOptimizer";
import DataFinalizer from "./DataFinalizer";

(async function () {
  const logos = await new LogoScrapper().run();
  console.log(logos);
  const images = await new ImageOptimizer().run();
  await new DataFinalizer({logos, images}).run();
})();
