<script setup>
import { RadarSpinner } from "epic-spinners";

const animationDuration = 1500;
const size = 400;
</script>

<template>
  <RadarSpinner
    :animation-duration="animationDuration"
    :size="size"
    color="rgb(244, 252, 30)"
    class="mx-auto my-40"
  />
</template>
