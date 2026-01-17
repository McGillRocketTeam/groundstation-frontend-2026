export function Gauge ({minNumber, maxNumber, value}: {minNumber: number, maxNumber: number, value: number}) {
    const inbetween = Math.round((maxNumber - minNumber)/6);

    const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
    const START_ANGLE = -135; // min value position
    const END_ANGLE = 135;    // max value position
    const OFFSET = 135;
    const v = clamp(value, minNumber, maxNumber);
    const t = (v - minNumber) / (maxNumber - minNumber || 1);
    const angle = START_ANGLE + t * (END_ANGLE - START_ANGLE)+OFFSET;

    return <div className="relative"><svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 642 634"
        className="absolute inset-0"
        fill="none"
    >
        <g clipPath="url(#a)">
            <path stroke="#fff" strokeWidth={2} d="M170 489h289v71H170z" />
            <text
                xmlSpace="preserve"
                fill="#FBFBFB"
                fontFamily="Inter"
                fontSize={64}
                letterSpacing="0em"
                style={{
                    whiteSpace: "pre",
                }}
            >
                <tspan x={169} y={549.773}>
                    {` ${value} TPS`}
                </tspan>
            </text>
            <path
                stroke="#fff"
                strokeWidth={8}
                d="m166.27 473.79 17.466-18.573M103 317.165l25.495-.165M321.165 123.495 321 98M515 317.165l25.495-.165M183.637 455.124l-17.267 18.758M475.979 471.207l-17.57-17.656M457.898 180.835l17.032-18.175M166 163.571l18.175 17.033"
            />
            <text
                xmlSpace="preserve"
                fill="#fff"
                fontFamily="Inter"
                fontSize={36}
                letterSpacing="0em"
                style={{
                    whiteSpace: "pre",
                }}
            >
                <tspan x={190} y={446.091}>
                    {minNumber}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                fill="#fff"
                fontFamily="Inter"
                fontSize={36}
                letterSpacing="0em"
                style={{
                    whiteSpace: "pre",
                }}
            >
                <tspan x={133} y={327.091}>
                    {inbetween}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                fill="#fff"
                fontFamily="Inter"
                fontSize={36}
                letterSpacing="0em"
                style={{
                    whiteSpace: "pre",
                }}
            >
                <tspan x={183} y={215.091}>
                    {inbetween*2}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                fill="#fff"
                fontFamily="Inter"
                fontSize={36}
                letterSpacing="0em"
                style={{
                    whiteSpace: "pre",
                }}
            >
                <tspan x={300} y={158.091}>
                    {inbetween*3}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                fill="#fff"
                fontFamily="Inter"
                fontSize={36}
                letterSpacing="0em"
                style={{
                    whiteSpace: "pre",
                }}
            >
                <tspan x={412} y={216.091}>
                    {inbetween*4}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                fill="#fff"
                fontFamily="Inter"
                fontSize={36}
                letterSpacing="0em"
                style={{
                    whiteSpace: "pre",
                }}
            >
                <tspan x={450} y={329.091}>
                    {inbetween*5}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                fill="#fff"
                fontFamily="Inter"
                fontSize={36}
                letterSpacing="0em"
                style={{
                    whiteSpace: "pre",
                }}
            >
                <tspan x={406} y={440.091}>
                    {maxNumber}
                </tspan>
            </text>
            <path
                fill="#FFA100"
                d="M496.452 501.701c38.411-35.262 65.191-80.983 76.819-131.151 11.627-50.169 7.558-102.436-11.673-149.929-19.232-47.493-52.724-87.987-96.074-116.159-43.35-28.171-94.528-42.7-146.803-41.677-52.275 1.023-103.201 17.551-146.08 47.41-42.879 29.86-75.704 71.653-94.158 119.883-18.455 48.23-21.675 100.64-9.237 150.338 12.438 49.697 39.952 94.355 78.923 128.102l18.436-20.458c-34.809-30.142-59.384-70.031-70.494-114.42-11.11-44.39-8.233-91.202 8.25-134.281 16.484-43.08 45.803-80.409 84.102-107.079 38.3-26.67 83.786-41.433 130.478-42.347 46.692-.914 92.404 12.064 131.124 37.226 38.72 25.163 68.636 61.333 85.813 103.753 17.177 42.42 20.812 89.105 10.426 133.916-10.385 44.81-34.305 85.648-68.614 117.143l18.762 19.73Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h641.567v633.946H0z" />
            </clipPath>
        </defs>
    </svg>

        <svg className="absolute inset-0" viewBox="0 0 642 634" fill="none" xmlns="http://www.w3.org/2000/svg">

            <g transform={`rotate(${angle} 321 317)`}>
                <path d="M358.896 279.467L331.153 319.679L318.368 306.745L358.896 279.467Z" fill="#EEF200"/>
                <path d="M228.382 407.904L316.395 308.11L329.181 321.043L228.382 407.904Z" fill="#EEF200"/>
            </g>


            <path d="M339 317C339 326.941 330.941 335 321 335C311.059 335 303 326.941 303 317C303 307.059 311.059 299 321 299C330.941 299 339 307.059 339 317Z" fill="#D9D9D9"/>
        </svg>

    </div>

}