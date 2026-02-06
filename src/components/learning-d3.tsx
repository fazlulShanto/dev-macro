import * as d3 from "d3";
import { useEffect, useRef } from "react";

export const LearningD3 = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    const data = [
        { x: 10, y: 20 },
        { x: 20, y: 40 },
        { x: 30, y: 60 },
        { x: 40, y: 80 },
        { x: 50, y: 100 },
    ];

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.append("rect").attr("x", 200).attr("y", 100).attr("width", "50%").attr("height", "50%").attr("fill", "red");
        svg.append("rect").attr("x", 10).attr("y", 120).attr("width", "50px").attr("height", "50%").attr("fill", "blue");
        // svg.selectAll('rect')
        //     .data(data)
        //     .enter()
        //     .append("rect")
        //     .attr("width", 5).attr("height", 5).attr("fill", "red") 
        //     .attr("x", function (d: any) { return d.x })
        //     .attr("y", function (d: any) { return d.y })

    }, [])
    return (
        <div >
            <svg viewBox="0 0 600 300" ref={svgRef} id="demo1" width="600" height="300" />
        </div>
    )
}