<script lang="ts">
  import Counter from "./lib/Counter.svelte";
  import HydrateCounter from "hydrate:lib/DoubleCounter.svelte";
  import LazyCounter from "lazy:lib/TrippleCounter.svelte";
</script>

<main>
  <h1>Partial Hydratino Demo</h1>

  <div class="card">
    <Counter />
    <HydrateCounter />
  </div>

  <div id="lipsum">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at blandit
      leo. Maecenas accumsan erat quis lectus semper, sit amet laoreet ex
      auctor. Suspendisse iaculis iaculis purus pellentesque pharetra. Nam
      ultricies leo a risus lobortis, quis laoreet est iaculis. Sed iaculis
      hendrerit nunc, ac accumsan metus tempus at. Curabitur suscipit feugiat
      nunc, varius lobortis erat sagittis ac. Maecenas ut bibendum justo.
      Aliquam venenatis, nisi ut auctor sodales, lorem magna congue elit, vitae
      egestas enim libero sit amet felis. Maecenas a cursus odio.
    </p>
    <p>
      Donec mattis neque quis velit lacinia tempor. Pellentesque faucibus nisl
      vitae auctor congue. Sed dictum dui libero, et tempus nibh laoreet non.
      Sed quis mollis justo. Aliquam non condimentum nunc, ut sagittis eros.
      Nulla aliquet metus pellentesque, tincidunt libero sed, sodales ante. Ut a
      hendrerit justo, iaculis pellentesque dolor. Praesent quis erat non lacus
      rhoncus faucibus a non urna. Proin eleifend ultricies lorem, vitae
      pharetra diam consectetur nec. Sed sed est mattis, pretium ante non,
      sodales ex. In sed quam nec ligula laoreet suscipit. Proin maximus
      tincidunt semper.
    </p>
    <p>
      Cras tristique odio purus, non lacinia quam mollis et. Ut a ornare mi.
      Duis ut massa eget leo consequat fringilla in id lacus. In luctus volutpat
      augue et convallis. Vestibulum venenatis pharetra est, non sagittis mi
      vehicula at. In congue risus ipsum. Pellentesque bibendum est eu lacinia
      efficitur. Sed id sem ullamcorper, ullamcorper enim sodales, tristique
      turpis. Nam sollicitudin porta metus, vulputate pellentesque ante dictum
      a. Praesent nec aliquet sapien, nec consectetur purus.
    </p>
    <p>
      Nam eleifend nunc eget justo feugiat, accumsan porta risus finibus. Nunc
      tincidunt mi ac eros tristique accumsan. Cras et faucibus quam. Phasellus
      bibendum ut est quis porta. Fusce efficitur, felis et convallis
      scelerisque, metus neque laoreet tellus, vel posuere ipsum nisi vitae
      magna. Phasellus id aliquet erat. Curabitur accumsan, mauris at tincidunt
      commodo, mi nisi laoreet tortor, non auctor ligula arcu sed nisi. Ut eu
      dapibus ligula, vel bibendum felis. Mauris vitae enim ultrices, egestas
      turpis ac, malesuada tellus. Aliquam congue, est ut cursus sodales, risus
      tortor sagittis elit, eget hendrerit ipsum nibh sed elit. Integer pretium,
      sapien sit amet vulputate lacinia, magna est vestibulum metus, in pretium
      massa tellus tincidunt ipsum. Morbi eu diam iaculis, ornare est vel,
      eleifend ipsum. Quisque a sollicitudin mi. Nam pretium pharetra orci a
      tempor. Pellentesque accumsan nisi dui, eu faucibus turpis hendrerit non.
    </p>
    <p>
      Fusce vulputate tortor non augue vehicula luctus. Sed elementum molestie
      ipsum, sed scelerisque purus iaculis et. Nullam egestas sodales risus id
      efficitur. Vestibulum sollicitudin diam in arcu venenatis mollis.
      Phasellus efficitur enim in justo eleifend porta. Curabitur porttitor nibh
      non felis sagittis, nec efficitur dolor vulputate. Cras dignissim, lacus
      consectetur efficitur varius, leo orci viverra tellus, eu interdum quam
      purus vel ipsum. Vestibulum ut nibh non neque finibus vulputate vel eu
      nulla.
    </p>
  </div>
  <LazyCounter />
</main>
