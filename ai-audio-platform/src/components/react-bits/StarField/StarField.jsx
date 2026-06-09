import React, { useEffect, useRef } from 'react';

const StarField = ({ speed = 0.05, backgroundColor = 'black', starColor = '#ffffff' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let stars = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            const numStars = Math.floor((canvas.width * canvas.height) / 2000); // Density
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: Math.random() * canvas.width,
                    o: '0.' + Math.floor(Math.random() * 99) + 1
                });
            }
        };

        const moveStars = () => {
            for (let i = 0; i < stars.length; i++) {
                let star = stars[i];
                star.z -= speed * 20; // Move star closer

                if (star.z <= 0) {
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
                    star.z = canvas.width;  // Reset to far away
                }
            }
        };

        const drawStars = () => {
            let pixelX, pixelY, pixelRadius;

            // Clear screen
            if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                resizeCanvas();
            }

            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = starColor;

            for (let i = 0; i < stars.length; i++) {
                let star = stars[i];
                pixelX = (star.x - canvas.width / 2) * (canvas.width / star.z);
                pixelX += canvas.width / 2;
                pixelY = (star.y - canvas.height / 2) * (canvas.width / star.z);
                pixelY += canvas.height / 2;
                pixelRadius = 1 * (canvas.width / star.z);

                ctx.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
                ctx.fillStyle = `rgba(209, 255, 255, ${star.o})`;
            }

            moveStars();
            animationFrameId = requestAnimationFrame(drawStars);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawStars();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [speed, backgroundColor, starColor]);

    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

export default StarField;
