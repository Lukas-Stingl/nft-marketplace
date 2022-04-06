/* Credits to Valgo on Codepen! https://codepen.io/Valgo/pen/PowZaNY */

import React, { useRef, useEffect } from 'react'
import "./Canvas.css"

const Canvas = props => {

    const text1Ref = useRef(null);
    const text2Ref = useRef(null);
    // The strings to morph between. You can change these to anything you want!
    const texts = [
        "Collect",
        "Create",
        "Explore",
        "Trade",
    ];

    // Controls the speed of morphing.
    const morphTime = 1;
    const cooldownTime = 0.5;

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;




    useEffect(() => {
        const text1 = text1Ref.current;
        const text2 = text2Ref.current;
        const elts = {
            text1: text1,
            text2: text2
        };
        elts.text1.textContent = texts[textIndex % texts.length];
        elts.text2.textContent = texts[(textIndex + 1) % texts.length];

        const doMorph = () => {
            morph -= cooldown;
            cooldown = 0;

            let fraction = morph / morphTime;

            if (fraction > 1) {
                cooldown = cooldownTime;
                fraction = 1;
            }

            setMorph(fraction);
        }

        // A lot of the magic happens here, this is what applies the blur filter to the text.
        const setMorph = (fraction) => {
            // fraction = Math.cos(fraction * Math.PI) / -2 + .5;

            elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
            elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

            fraction = 1 - fraction;
            elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
            elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

            elts.text1.textContent = texts[textIndex % texts.length];
            elts.text2.textContent = texts[(textIndex + 1) % texts.length];
        }

        const doCooldown = () => {
            morph = 0;

            elts.text2.style.filter = "";
            elts.text2.style.opacity = "100%";

            elts.text1.style.filter = "";
            elts.text1.style.opacity = "0%";
        }

        // Animation loop, which is called every frame.
        const animate = () => {
            requestAnimationFrame(animate);

            let newTime = new Date();
            let shouldIncrementIndex = cooldown > 0;
            let dt = (newTime - time) / 1000;
            time = newTime;

            cooldown -= dt;

            if (cooldown <= 0) {
                if (shouldIncrementIndex) {
                    textIndex++;
                }

                doMorph();
            } else {
                doCooldown();
            }
        }
        // Start the animation.
        animate();

    }, [])

    return (
        <div>
            <div id="container" {...props}>
                <span id="text1" ref={text1Ref} ></span>
                <span id="text2" ref={text2Ref}></span>

            </div>
            <svg id="filters">
                <defs>
                    <filter id="threshold">
                        <feColorMatrix in="SourceGraphic"
                            type="matrix"
                            values="1 0 0 0 0
									0 1 0 0 0
									0 0 1 0 0
									0 0 0 255 -140" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
}

export default Canvas