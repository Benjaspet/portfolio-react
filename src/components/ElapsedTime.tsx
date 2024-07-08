/*
 * Copyright © 2024 Ben Petrillo. All rights reserved.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use,
 * provided that credit is given to the original author(s).
 */

import React, { useState, useEffect } from "react";

const ElapsedTime: React.FC = () => {

    const specificDate: Date = new Date('March 11, 2020 04:26:00');
    const [elapsedTime, setElapsedTime] = useState(calculateElapsedTime());

    useEffect(() => {
        const interval: number = setInterval(() => {
            setElapsedTime(calculateElapsedTime());
        }, 10);
        return () => clearInterval(interval);
    });

    function calculateElapsedTime() {
        const now: Date = new Date();
        const elapsedMs: number = now.getTime() - specificDate.getTime();
        const elapsed = {
            days: Math.floor(elapsedMs / (1000 * 60 * 60 * 24)),
            hours: Math.floor((elapsedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: parseFloat(((elapsedMs % (1000 * 60)) / 1000).toFixed(1))
        }
        const { days, hours, minutes, seconds } = elapsed;
        const formattedWithCommas = (num: number): string => {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return { days, daysString: formattedWithCommas(days), hours, minutes, seconds };
    }

    const days = elapsedTime.daysString + " day" + (elapsedTime.days != 1 ? "s, " : ",")
    const hours = elapsedTime.hours + " hour" + (elapsedTime.hours != 1 ? "s, " : ",")
    const minutes = elapsedTime.minutes + " minute" + (elapsedTime.minutes != 1 ? "s, " : ",")
    const seconds = elapsedTime.seconds + " second" + (elapsedTime.seconds != 1 ? "s" : "")

    return (
        <p>
            15-year-old me would have never imagined that I would be where I am today. A simple
            interest in developing plugins for Minecraft servers has evolved into my career.
            My programming journey began on March 11, 2020.
            The elapsed time is <b>{days} {hours} {minutes}</b> and <b>{seconds}</b>.
        </p>
    );
};

export default ElapsedTime;