import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import type { SankeyLink as D3SankeyLink, SankeyNode as D3SankeyNode } from "d3-sankey";

const sanekeyData = {
    nodes: [
        // Column 1: Channels
        { id: "channel-1", name: "345", category: "Channels", color: "#BFDBFE" },
        { id: "channel-2", name: "265", category: "Channels", color: "#BFDBFE" },
        { id: "channel-3", name: "189", category: "Channels", color: "#BFDBFE" },
        { id: "channel-4", name: "140", category: "Channels", color: "#BFDBFE" },

        // Column 2: AI Handling
        { id: "ai-resolved", name: "178", category: "AI Handling", color: "#bcf0c2", subLabel: "AI Resolved" },
        { id: "ai-reassigned", name: "127", category: "AI Handling", color: "#ffe0b2", subLabel: "Reassigned to Human Agent" },
        { id: "ai-fallback", name: "60", category: "AI Handling", color: "#e5e7eb", subLabel: "Fallback" },

        // Column 3: Support Types
        { id: "support-cashback", name: "123", category: "Support Types", color: "#e9d5ff", subLabel: "Cash backs & Rewards" },
        { id: "support-billing", name: "78", category: "Support Types", color: "#dcfce7", subLabel: "Billing" },
        { id: "support-technical", name: "56", category: "Support Types", color: "#fbcfe8", subLabel: "Technical Issues" },
        { id: "support-sales", name: "34", category: "Support Types", color: "#bfdbfe", subLabel: "Sales" },
        { id: "support-others", name: "16", category: "Support Types", color: "#e5e7eb", subLabel: "Others" },

        // Column 4: Customer Experience
        { id: "cx-positive", name: "178", category: "Customer Experience", color: "#6CDF8E", subLabel: "Positive CX (60%)" },
        { id: "cx-neutral", name: "56", category: "Customer Experience", color: "#FBC672", subLabel: "Neutral CX (26%)" },
        { id: "cx-negative", name: "32", category: "Customer Experience", color: "#F77777", subLabel: "Negative CX (14%)" },

    ],
    links: [
        // Col 1 -> Col 2
        { source: "channel-1", target: "ai-resolved", value: 100 },
        { source: "channel-1", target: "ai-reassigned", value: 100 },
        { source: "channel-2", target: "ai-resolved", value: 78 },
        { source: "channel-2", target: "ai-reassigned", value: 27 },
        { source: "channel-3", target: "ai-fallback", value: 60 },
        { source: "channel-4", target: "ai-fallback", value: 30 },

        // Col 2 -> Col 3
        { source: "ai-resolved", target: "support-cashback", value: 100 },
        { source: "ai-resolved", target: "support-billing", value: 78 },
        { source: "ai-reassigned", target: "support-cashback", value: 23 },
        { source: "ai-reassigned", target: "support-technical", value: 56 },
        { source: "ai-reassigned", target: "support-sales", value: 34 },
        { source: "ai-reassigned", target: "support-others", value: 14 },
        { source: "ai-fallback", target: "support-others", value: 2 },

        // Col 3 -> Col 4
        { source: "support-cashback", target: "cx-positive", value: 123 },
        { source: "support-billing", target: "cx-positive", value: 55 },
        { source: "support-technical", target: "cx-neutral", value: 64 },
        { source: "support-sales", target: "cx-negative", value: 32 },
        { source: "support-sales", target: "cx-neutral", value: 32 },
        { source: "support-billing", target: "cx-neutral", value: 123 },
        { source: "support-sales", target: "cx-negative", value: 2 },
        { source: "support-others", target: "cx-negative", value: 1 },

    ]
};

interface MySankeyNodeExtra {
    id: string;
    name: string;
    category: string;
    color?: string;
    subLabel?: string;
}

interface MySankeyLinkExtra {
    // Add any extra link properties if needed
}



type MySankeyNode = D3SankeyNode<MySankeyNodeExtra, MySankeyLinkExtra>;
type MySankeyLink = D3SankeyLink<MySankeyNodeExtra, MySankeyLinkExtra>;

interface SankeyData {
    nodes: MySankeyNodeExtra[];
    links: Array<{
        source: string;
        target: string;
        value: number;
    }>;
}

export default function Sankey() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: 600, // Fixed height or dynamic
                });
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!dimensions.width || !dimensions.height) return;

        const data: SankeyData = sanekeyData;

        // Clean links
        const cleanLinks = data.links.filter(l => l.value > 0);

        const sankeyGenerator = d3Sankey<MySankeyNodeExtra, MySankeyLinkExtra>()
            .nodeId(d => d.id)
            .nodeWidth(200)
            .nodePadding(40)
            .extent([[10, 40], [dimensions.width - 200, dimensions.height - 20]]);

        // clone data
        const { nodes: graphNodes, links: graphLinks } = sankeyGenerator({
            nodes: data.nodes.map(d => ({ ...d })),
            links: cleanLinks.map(d => ({ ...d })) as any
        });

        // Custom Logic: Clamp Node Heights and Scale Links (based on d3-sankey PR #122)
        const MAX_NODE_HEIGHT = 150;

        graphNodes.forEach((node: any) => {
            const originalHeight = node.y1 - node.y0;

            if (originalHeight > MAX_NODE_HEIGHT) {
                // Calculate scale factor for link widths
                const scaleFactor = MAX_NODE_HEIGHT / originalHeight;
                const cy = (node.y0 + node.y1) / 2;

                // Clamp node height, centered
                node.y0 = cy - MAX_NODE_HEIGHT / 2;
                node.y1 = cy + MAX_NODE_HEIGHT / 2;

                // Scale down link widths proportionally for incoming links
                if (node.targetLinks) {
                    node.targetLinks.forEach((link: any) => {
                        link.width = link.width * scaleFactor;
                    });
                }

                // Scale down link widths proportionally for outgoing links
                if (node.sourceLinks) {
                    node.sourceLinks.forEach((link: any) => {
                        link.width = link.width * scaleFactor;
                    });
                }
            }
        });

        // Recompute link breadths (y0, y1) after scaling - mimics d3-sankey's computeLinkBreadths
        graphNodes.forEach((node: any) => {
            let y0 = node.y0;

            // Position outgoing links (source links)
            if (node.sourceLinks) {
                for (const link of node.sourceLinks) {
                    link.y0 = y0 + link.width / 2;
                    y0 += link.width;
                }
            }

            // Position incoming links (target links)
            // Each link should be centered at the destination node's vertical center
            // This maintains the destination node's height for all incoming links
            if (node.targetLinks) {
                const nodeCenterY = (node.y0 + node.y1) / 2;

                for (const link of node.targetLinks) {
                    // Center the link at the node's vertical center
                    link.y1 = nodeCenterY;
                }
            }
        });

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const defs = svg.append("defs");

        graphLinks.forEach((link, i) => {
            const gradientId = `gradient-${i}`;
            const source = link.source as MySankeyNode;
            const target = link.target as MySankeyNode;

            const gradient = defs.append("linearGradient")
                .attr("id", gradientId)
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", source.x1 || 0)
                .attr("x2", target.x0 || 0);

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", source.color || "#ccc");

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", target.color || "#ccc");
        });

        svg.append("g")
            .attr("fill", "none")
            .selectAll("path")
            .data(graphLinks)
            .join("path")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke", (d, i) => `url(#gradient-${i})`)
            .attr("stroke-width", d => Math.max(1, d.width || 0))
            .attr("stroke-opacity", 0.5);

        const nodes = svg.append("g")
            .selectAll("g")
            .data(graphNodes)
            .join("g")
            .attr("transform", d => `translate(${d.x0 || 0},${d.y0 || 0})`);

        nodes.append("rect")
            .attr("height", d => (d.y1 || 0) - (d.y0 || 0))
            .attr("width", d => (d.x1 || 0) - (d.x0 || 0))
            .attr("fill", d => d.color || "#ccc")
            .attr("rx", 6);

        nodes.append("text")
            .attr("x", d => ((d.x1 || 0) - (d.x0 || 0)) / 2)
            .attr("y", d => ((d.y1 || 0) - (d.y0 || 0)) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(d => d.name)
            .attr("font-weight", "bold")
            .attr("fill", "#333");

        // Sublabels
        svg.append("g")
            .selectAll("text")
            .data(graphNodes.filter(n => n.subLabel))
            .join("text")
            .attr("x", d => d.x0 || 0)
            .attr("y", d => (d.y1 || 0) + 15)
            .text(d => d.subLabel!)
            .attr("font-size", "12px")
            .attr("fill", "#666");

        // Channel placeholders
        const channelNodes = graphNodes.filter(n => n.category === "Channels");
        svg.append("g")
            .selectAll("text")
            .data(channelNodes)
            .join("text")
            .attr("x", d => d.x0 || 0)
            .attr("y", d => (d.y1 || 0) + 20)
            .text("Channel name will be here")
            .attr("font-size", "12px")
            .attr("fill", "#666");

    }, [dimensions]);

    return (
        <div ref={containerRef} className="w-full h-full p-8 bg-white" style={{ minHeight: "700px" }}>
            <div className="flex justify-between mb-8 px-4 font-bold text-gray-500 uppercase text-sm">
                <div>Channels</div>
                <div>AI Handling</div>
                <div>Support Types</div>
                <div>Customer Experience</div>
            </div>
            <svg ref={svgRef} width="100%" height={dimensions.height} style={{ overflow: "visible" }} />
            <div className="mt-4 px-4">
                <button className="px-6 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer">
                    See More
                    <span className="text-xs">▼</span>
                </button>
            </div>
        </div>
    );
}