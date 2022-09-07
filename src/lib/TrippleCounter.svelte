<script lang="ts">
  let count: number = 0;
  const increment = () => {
    count += 3;
  };
</script>

<p>I am a tripple counter lazy loaded</p>
<button on:click={increment}>
  count is {count}
</button>
