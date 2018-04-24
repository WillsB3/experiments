registerPaint(
  "ticket",
  class {
    static get inputProperties() {
      return ["--cutout-radius", "--cutout-edge"];
    }

    paint(ctx, geom, properties) {
      const twoPi = Math.PI * 2;
      const height = geom.height;
      const width = geom.width;
      let radius = properties.get("--cutout-radius");
      let edge = properties.get("--cutout-edge");

      const drawCutout = (x, y) => {
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, 0, twoPi);
        ctx.closePath();
        ctx.fill();
      };

      // Main ticket area
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      if (!edge || !radius) {
        return;
      }

      radius = parseInt(radius.toString());
      edge = edge.toString().trim();

      // Draw cutouts
      ctx.globalCompositeOperation = "destination-out";

      if (edge === "top" || edge === "both") {
        drawCutout(0, 0);
        drawCutout(width, 0);
      }
      if (edge === "bottom" || edge === "both") {
        drawCutout(width, height);
        drawCutout(0, height);
      }
    }
  }
);
