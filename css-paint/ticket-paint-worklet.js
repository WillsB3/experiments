registerPaint('ticket', class {
    static get inputProperties() {
        return [
            '--cutout-bottom',
            '--cutout-radius',
            '--cutout-top'
        ];
    }

    paint(ctx, geom, properties) {
        let cutoutTop = properties.get('--cutout-top');
        let cutoutBottom = properties.get('--cutout-bottom');
        const radius = parseInt(properties.get('--cutout-radius').toString());
        const height = geom.height;
        const width = geom.width;

        // console.group('cutout');
        // console.log('--cutout-radius', radius);
        // console.log('ctx', ctx);
        // console.log('properties', properties);
        // console.log('cutoutTop', cutoutTop, 'cutoutBottom', cutoutBottom);
        // console.info(height, width);
        // console.groupEnd();

        const radToDeg = (rad) => {
            return rad * 180 / Math.PI;
        }

        const drawCutout = (x, y) => {
            ctx.fillStyle = '#ffffff';
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, radToDeg(0), radToDeg(360));
            ctx.closePath();
            ctx.fill();
        }

        // Main ticket area
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Draw cutouts
        ctx.globalCompositeOperation = 'destination-out';

        if (cutoutTop) {
            drawCutout(0, 0);
            drawCutout(width, 0);
        }
        if (cutoutBottom) {
            drawCutout(width, height);
            drawCutout(0, height);
        }
    }
});
