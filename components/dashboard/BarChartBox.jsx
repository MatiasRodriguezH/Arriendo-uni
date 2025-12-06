"use client";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer
} from "recharts";

export default function BarChartBox({ title, data }) {
    return (
        <div className="chart-box">
            <h2>{title}</h2>

            <ResponsiveContainer width="100%" height={290}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" tick={{fontSize:'10'}}/>
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#2c434dff"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
