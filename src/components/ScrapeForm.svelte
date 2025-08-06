<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from "../routes/$types";

    let { handleScrapedData } = $props();

    const formSubmitHandler = () => {
		return async ({ update, result }) => {
            handleScrapedData(result.data);

			await update();
		};
    };
</script>

<div class="border p-5 box-border">
    <form method="POST" class="flex flex-col gap-2" use:enhance={formSubmitHandler}>
        <input class="border" placeholder="page url" type="text" name="url"/>
        <button class="border hover:bg-gray-300 active:bg-gray-500">Scrape</button>
    </form>
</div>