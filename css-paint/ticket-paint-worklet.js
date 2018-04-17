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
        const height = geom.height + 4;
        const width = geom.width + 4;

        console.group('cutout');
        // console.log('--cutout-radius', radius);
        // console.log('ctx', ctx);
        console.log('geom', geom);
        // console.log('properties', properties);
        // console.log('cutoutTop', cutoutTop, 'cutoutBottom', cutoutBottom);

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
        ctx.fillRect(-2, -2, width, height);

        // Draw cutouts
        ctx.globalCompositeOperation = 'destination-out';

        const topLeft = {
            x: 0,
            y: 0
        };

        const topRight = {
            x: geom.width,
            y: 0
        };

        const bottomRight = {
            x: geom.width,
            y: geom.height
        };

        const bottomLeft = {
            x: 0,
            y: geom.height
        };

        if (cutoutTop) {
            drawCutout(topLeft.x, topLeft.y);
            drawCutout(topRight.x, topRight.y);
        }
        if (cutoutBottom) {
            drawCutout(bottomRight.x, bottomRight.y);
            drawCutout(bottomLeft.x, bottomLeft.y);
        }

        console.groupEnd();
    }
});
