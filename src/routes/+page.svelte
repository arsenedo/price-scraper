<script lang="ts">
	import BarChart from "../components/BarChart.svelte";
	import ScrapeForm from "../components/ScrapeForm.svelte";
	import type { ActionData } from "./$types";

    let data = $state<{priceRange: string, count: number}[]>([]);

    const handleScrapedData = (scrapedData: ActionData) => {
        const div = document.createElement('div');
    
        if (scrapedData.scrapedBody === null) {
            return;
        }

        div.innerHTML = scrapedData.scrapedBody;

        const priceArray = [...div.querySelectorAll('.s-card__price')]
        .map((HTMLElement) => parseFloat(HTMLElement.textContent.replace(/[^0-9.-]+/g, "")))
        .sort((a, b) => a - b);

        data = [];
        const groupSize = 50;
        for (const price of priceArray) {
            const groupIndex = Math.floor(price / groupSize);

            const min = groupIndex * groupSize;
            const max = min + groupSize - 1; // inclusive

            const label = `${min} - ${max}`;

            if (data[groupIndex]?.priceRange) {
                data[groupIndex].count += 1;
                continue;
            }

            data[groupIndex] = {priceRange: label, count: 1};
        }
    } 

      /*const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];*/
</script>

<div class="flex h-full flex-col justify-center items-center gap-5">
    <ScrapeForm handleScrapedData={handleScrapedData}/>

    {#if data.length !== 0}
        <BarChart 
            labels={data.map(row => row.priceRange)} 
            datasets={[
                {
                    label: 'Items sold by price group', 
                    data: data.map(row => row.count)
                }
            ]}
        />
    {/if}
</div>
