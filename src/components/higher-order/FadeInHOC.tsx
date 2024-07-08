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

import React, { ReactNode, useState } from "react";
import { useSpring, animated, UseSpringProps } from "@react-spring/web";
import { Waypoint } from "react-waypoint";

interface FadeInProps {
    children: ReactNode;
}

const props = (inView: boolean): UseSpringProps => ({
    opacity: inView ? 1 : 0,
    from: { opacity: 0 },
    config: { duration: 1500 },
});

const FadeInHOC: React.FC<FadeInProps> = ({ children }) => {

    const [inView, setInView] = useState(false);
    const springProps = useSpring(props(inView));

    return (
        <Waypoint onEnter={() => setInView(true)}>
            <animated.div style={springProps}>
                {children}
            </animated.div>
        </Waypoint>
    );
};

export default FadeInHOC;