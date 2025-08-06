<script lang="ts">
	import { Chart } from "chart.js/auto";

    let { labels, datasets } = $props();

    let canvas = $state<HTMLCanvasElement>();
    let barChart: Chart | null = null;

    
    $effect(() => {
        if (!canvas) {
            return;
        }
        
        const chartConfig = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            }
        }

        const barChart = new Chart(canvas, chartConfig);

        return () => {
            if (barChart) {
                barChart.destroy();
            }
        };
    })
</script>

<div class="w-2/3">
    <canvas bind:this={canvas}></canvas>
</div>