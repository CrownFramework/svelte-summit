<script lang="ts">
  let count: number = 0;
  const increment = () => {
    count += 2;
  };
</script>

<p>I am a double counter hydrated</p>
<button on:click={increment}>
  count is {count}
</button>
