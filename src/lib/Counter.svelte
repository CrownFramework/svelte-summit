<script lang="ts">
  let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<p>I am a single counter not hydrated</p>
<button on:click={increment}>
  count is {count}
</button>
