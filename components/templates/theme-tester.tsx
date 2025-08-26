'use client'
import React, { useEffect, useState } from "react";

const colorClasses = [
    "background",
    "foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "muted-foreground",
    "accent",
    "destructive",
    "border",
    "input",
    "ring",
    "sidebar",
    "sidebar-foreground",
    "sidebar-primary",
    "sidebar-primary-foreground",
    "sidebar-accent",
    "sidebar-accent-foreground",
    "sidebar-border",
    "sidebar-ring",
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",

];

function oklchToHex(oklch: string): string {
    const match = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(deg)?\s*\)/);
    if (!match) return oklch;

    const L = parseFloat(match[1]);
    const C = parseFloat(match[2]);
    const H = parseFloat(match[3]);
    const radians = (H / 180) * Math.PI;

    const a = Math.cos(radians) * C;
    const b = Math.sin(radians) * C;

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;

    let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let b_ = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const toHex = (v: number) =>
        Math.round(clamp(v) * 255)
            .toString(16)
            .padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b_)}`;
}

interface ColorSwatchProps {
    color: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color }) => {
    const [hex, setHex] = useState<string>("");

    useEffect(() => {
        const cssVar = getComputedStyle(document.documentElement).getPropertyValue(`--${color}`).trim();
        const hexColor = oklchToHex(cssVar);
        setHex(hexColor);
    }, [color]);

    return (
        <div className="flex flex-col items-center">
            <div
                className="w-16 h-16 rounded shadow"
                style={{ backgroundColor: `var(--${color})` }}
            />
            <span className="mt-2 text-sm text-muted-foreground text-center">{color}</span>
            <span className="text-xs text-muted-foreground">{hex}</span>
        </div>
    );
};

const ColorSwatches: React.FC = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {colorClasses.map((color) => (
                <ColorSwatch key={color} color={color} />
            ))}
        </div>
    );
};

export default ColorSwatches;
