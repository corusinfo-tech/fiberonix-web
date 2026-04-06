import { useState, useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { NetworkLayout } from "@/components/NetworkLayout";

const LinkBudgetGraph = () => {
  // 🔹 Inputs
  const [inputPower, setInputPower] = useState(10);
  const [fiberLength, setFiberLength] = useState(10);
  const [attenuation, setAttenuation] = useState(0.35);
  const [spliceCount, setSpliceCount] = useState(2);
  const [spliceLoss, setSpliceLoss] = useState(0.1);
  const [connectorCount, setConnectorCount] = useState(2);
  const [connectorLoss, setConnectorLoss] = useState(0.75);
  const [safetyMargin, setSafetyMargin] = useState(3);

  // 🔹 Calculations
  const {
    fiberLoss,
    totalSpliceLoss,
    totalConnectorLoss,
    totalLoss,
    outputPower,
  } = useMemo(() => {
    const fiberLoss = fiberLength * attenuation;
    const totalSpliceLoss = spliceCount * spliceLoss;
    const totalConnectorLoss = connectorCount * connectorLoss;

    const totalLoss =
      fiberLoss + totalSpliceLoss + totalConnectorLoss + safetyMargin;

    const outputPower = inputPower - totalLoss;

    return {
      fiberLoss,
      totalSpliceLoss,
      totalConnectorLoss,
      totalLoss,
      outputPower,
    };
  }, [
    inputPower,
    fiberLength,
    attenuation,
    spliceCount,
    spliceLoss,
    connectorCount,
    connectorLoss,
    safetyMargin,
  ]);

  // 🔹 Color logic
  const getColor = (value: number) => {
    if (value > -10) return "#22c55e";
    if (value > -20) return "#f59e0b";
    return "#ef4444";
  };

  // 🔹 Graph Data
  const { nodes, edges } = useMemo(() => {
    const nodes = [
      {
        id: "input",
        position: { x: 0, y: 150 },
        data: { label: `Input\n${inputPower} dBm` },
        style: {
          background: "#111",
          color: "#fff",
          padding: 10,
          borderRadius: 10,
        },
      },

      {
        id: "fiber",
        position: { x: 250, y: 50 },
        data: {
          label: `Fiber\n-${fiberLoss.toFixed(2)} dB\n(${fiberLength} km)`,
        },
      },

      {
        id: "splice",
        position: { x: 250, y: 150 },
        data: {
          label: `Splice\n-${totalSpliceLoss.toFixed(2)} dB`,
        },
      },

      {
        id: "connector",
        position: { x: 250, y: 250 },
        data: {
          label: `Connector\n-${totalConnectorLoss.toFixed(2)} dB`,
        },
      },

      {
        id: "margin",
        position: { x: 500, y: 150 },
        data: {
          label: `Margin\n-${safetyMargin} dB`,
        },
      },

      {
        id: "output",
        position: { x: 750, y: 150 },
        data: {
          label: `Output\n${outputPower.toFixed(2)} dBm`,
        },
        style: {
          background: getColor(outputPower),
          color: "#000",
          padding: 10,
          borderRadius: 10,
        },
      },
    ];

    const edges = [
      { id: "e1", source: "input", target: "fiber", animated: true },
      { id: "e2", source: "input", target: "splice", animated: true },
      { id: "e3", source: "input", target: "connector", animated: true },

      { id: "e4", source: "fiber", target: "margin" },
      { id: "e5", source: "splice", target: "margin" },
      { id: "e6", source: "connector", target: "margin" },

      { id: "e7", source: "margin", target: "output", animated: true },
    ];

    return { nodes, edges };
  }, [
    inputPower,
    fiberLoss,
    fiberLength,
    totalSpliceLoss,
    totalConnectorLoss,
    safetyMargin,
    outputPower,
  ]);

  return (
    <NetworkLayout>
      <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900 text-white rounded-xl border border-border shadow-xl overflow-hidden">
        {/* 🔷 Header */}
        <div className="p-4 border-b border-white/10 shrink-0">
          <h1 className="text-2xl font-bold">Link Budget Graph</h1>
          <p className="text-sm text-gray-400">
            Visual calculation of optical link losses
          </p>
        </div>

        {/* 🔷 Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* 🔷 Left Panel (Inputs) */}
        <div className="w-full md:w-80 p-4 border-b md:border-b-0 md:border-r border-white/10 space-y-4 overflow-y-auto max-h-[35vh] md:max-h-none shrink-0">
          <h2 className="font-semibold text-lg">Inputs</h2>

          {[
            ["Input Power (dBm)", inputPower, setInputPower],
            ["Fiber Length (km)", fiberLength, setFiberLength],
            ["Attenuation (dB/km)", attenuation, setAttenuation],
            ["Splice Count", spliceCount, setSpliceCount],
            ["Splice Loss (dB)", spliceLoss, setSpliceLoss],
            ["Connector Count", connectorCount, setConnectorCount],
            ["Connector Loss (dB)", connectorLoss, setConnectorLoss],
            ["Safety Margin (dB)", safetyMargin, setSafetyMargin],
          ].map(([label, value, setter]: any, i) => (
            <div key={i}>
              <label className="text-sm text-gray-300">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className="w-full mt-1 px-2 py-1 rounded bg-slate-800 border border-white/10"
              />
            </div>
          ))}

          {/* Summary */}
          <div className="mt-4 p-3 bg-slate-800 rounded-xl">
            <p>Total Loss: {totalLoss.toFixed(2)} dB</p>
            <p>Output Power: {outputPower.toFixed(2)} dBm</p>
          </div>
        </div>

        {/* 🔷 Graph */}
        <div className="flex-1 min-h-[300px] md:min-h-0">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
      </div>
    </NetworkLayout>
  );
};

export default LinkBudgetGraph;