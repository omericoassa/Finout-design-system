import { useState, useMemo } from 'react';
import buttonsData from './data/buttons.json';
import { Button } from './components/Button';

function App() {
    // Logic:
    // "buttons with height of below 24px should be 'Mini'" (h < 24)
    // "buttons with height of below 32px should be 'Small'" (h < 32)
    // "buttons with height of below or equal to 40px should be 'Regular'" (h <= 40)
    // Else -> Large (h > 40)

    const classifyButton = (height) => {
        if (height < 24) return 'mini';
        if (height < 32) return 'small';
        if (height <= 40) return 'regular';
        return 'large';
    };

    const getVariant = (color, className) => {
        if (color && color.includes('pink')) return 'primary';
        if (className.includes('bg-transparent') || className.includes('border-none')) return 'ghost';
        return 'secondary';
    };

    const analyzedData = useMemo(() => {
        return buttonsData.map(btn => ({
            ...btn,
            newSize: classifyButton(btn.height),
            newVariant: getVariant(btn.color, btn.className)
        }));
    }, []);

    const stats = useMemo(() => {
        const s = {};
        analyzedData.forEach(btn => {
            const key = `${btn.newVariant} - ${btn.newSize}`;
            s[key] = (s[key] || 0) + 1;
        });
        return s;
    }, [analyzedData]);

    return (
        <div className="min-h-screen bg-neutrals-50 font-sans text-neutrals-500">
            <div className="max-w-7xl mx-auto p-8 space-y-8">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-neutrals-600">Button Migration Analysis</h1>
                    <p className="text-neutrals-400">Normalization of legacy button styles to New System based on height rules.</p>
                </div>

                {/* Showcase of New Sizes */}
                <div className="bg-white rounded-xl shadow-sm border border-neutrals-200 p-6 space-y-6">
                    <h2 className="text-xl font-bold text-neutrals-600">New Button Sizes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="h-12 flex items-center">
                                <Button size="mini" variant="primary">Mini Button</Button>
                            </div>
                            <p className="text-xs text-neutrals-400">
                                Size: <strong>Mini</strong><br />
                                Height: 20px (h-5)<br />
                                Rule: &lt; 24px
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-12 flex items-center">
                                <Button size="small" variant="primary">Small Button</Button>
                            </div>
                            <p className="text-xs text-neutrals-400">
                                Size: <strong>Small</strong><br />
                                Height: 28px (h-7)<br />
                                Rule: &lt; 32px
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-12 flex items-center">
                                <Button size="regular" variant="primary">Regular Button</Button>
                            </div>
                            <p className="text-xs text-neutrals-400">
                                Size: <strong>Regular</strong><br />
                                Height: 36px (h-9)<br />
                                Rule: 32px - 40px
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-12 flex items-center">
                                <Button size="large" variant="primary">Large Button</Button>
                            </div>
                            <p className="text-xs text-neutrals-400">
                                Size: <strong>Large</strong><br />
                                Height: 44px (h-11)<br />
                                Rule: &gt; 40px
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Dashboard */}
                <div className="bg-white rounded-xl shadow-sm border border-neutrals-200 p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutrals-50 p-4 rounded-lg border border-neutrals-100">
                            <div className="text-sm text-neutrals-400 font-medium">Original Variables</div>
                            <div className="text-4xl font-bold text-neutrals-600">{buttonsData.length}</div>
                        </div>
                        <div className="bg-neutrals-50 p-4 rounded-lg border border-neutrals-100">
                            <div className="text-sm text-neutrals-400 font-medium">New Variants</div>
                            <div className="text-4xl font-bold text-neutrals-600">{Object.keys(stats).length}</div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutrals-500 uppercase tracking-wider mb-3">Active Variants Distribution</h3>
                        <div className="overflow-hidden rounded-lg border border-neutrals-200">
                            <table className="min-w-full divide-y divide-neutrals-200">
                                <thead className="bg-neutrals-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutrals-400 uppercase tracking-wider">Variant</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-neutrals-400 uppercase tracking-wider">Count</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-neutrals-200">
                                    {Object.entries(stats).map(([variant, count]) => (
                                        <tr key={variant}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutrals-600 capitalize">{variant}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutrals-400 text-right">{count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Button List */}
                <div className="space-y-4">
                    {analyzedData.map((btn) => (
                        <div key={btn.id} className="bg-white rounded-xl shadow-sm border border-neutrals-200 p-6 flex flex-col md:flex-row gap-6 items-center justify-between">

                            {/* Metadata */}
                            <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg text-neutrals-600">{btn.id}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${btn.newSize === 'mini' ? 'bg-red-50 text-red-600' : btn.newSize === 'small' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                        Height: {btn.height}px
                                    </span>
                                </div>

                                <div className="text-sm text-neutrals-400 space-y-1">
                                    <div><span className="font-semibold text-neutrals-500">Original ClassName:</span> <code className="bg-neutrals-50 px-1 rounded text-xs">{btn.className || 'N/A'}</code></div>
                                    <div><span className="font-semibold text-neutrals-500">Original Color:</span> {btn.color || 'N/A'}</div>
                                </div>

                                <div className="mt-2 text-sm font-medium text-blue-500">
                                    New System: {btn.newVariant} - {btn.newSize}
                                </div>
                            </div>

                            {/* Visual Comparison (Original approx vs New) */}
                            <div className="flex items-center gap-8 border-l border-neutrals-100 pl-8">
                                <div className="text-center space-y-2">
                                    <div className="text-xs text-neutrals-300 font-semibold uppercase">New Component</div>
                                    <Button size={btn.newSize} variant={btn.newVariant}>
                                        Lorem, ipsum dolor
                                    </Button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default App;
