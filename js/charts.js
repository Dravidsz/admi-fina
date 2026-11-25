function createBarChart(containerId, labels, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth || 600;
    canvas.height = 320;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 40, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const minVal = options.minY !== undefined ? options.minY : Math.min(0, ...data);
    const maxVal = options.maxY !== undefined ? options.maxY : Math.max(0, ...data);
    const range = maxVal - minVal || 1;

    function scaleY(value) {
        return padding.top + chartHeight - ((value - minVal) / range) * chartHeight;
    }

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Axis
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Zero line
    const zeroY = scaleY(0);
    ctx.strokeStyle = '#666';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, zeroY);
    ctx.lineTo(width - padding.right, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
        const val = minVal + (range * i / steps);
        const y = scaleY(val);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = '#666';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(options.yDecimals !== undefined ? options.yDecimals : 0), padding.left - 8, y + 4);
    }

    // Bars
    const barWidth = chartWidth / (data.length * 1.8);
    const gap = chartWidth / (data.length * 2.8);

    data.forEach((value, i) => {
        const x = padding.left + gap + i * (barWidth + gap);
        const y = scaleY(value);
        const h = zeroY - y;

        ctx.fillStyle = value >= 0 ? 'oklch(0.520 0.165 40)' : 'oklch(0.540 0.175 25)';
        ctx.fillRect(x, h >= 0 ? y : zeroY, barWidth, Math.abs(h));

        // Value label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        const labelY = h >= 0 ? y - 6 : zeroY + Math.abs(h) + 14;
        let labelText = value.toFixed(options.valueDecimals !== undefined ? options.valueDecimals : 1);
        if (options.suffix) labelText += options.suffix;
        ctx.fillText(labelText, x + barWidth / 2, labelY);

        // X label
        ctx.save();
        ctx.translate(x + barWidth / 2, height - padding.bottom + 15);
        ctx.rotate(Math.PI / 6);
        ctx.textAlign = 'left';
        ctx.font = '11px sans-serif';
        ctx.fillText(labels[i], 0, 0);
        ctx.restore();
    });

    // Title
    if (options.title) {
        ctx.fillStyle = 'oklch(0.520 0.165 40)';
        ctx.font = 'bold 14px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, width / 2, 20);
    }

    // Y axis label
    if (options.yLabel) {
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.fillText(options.yLabel, 0, 0);
        ctx.restore();
    }
}
