<template>
    <div class="my-5">
        <NuxtLink :to="props.path || '/'">
            <span class="inline-flex items-center gap-2">
                <el-icon>
                    <ElIconArrowLeft />
                </el-icon>
                Zurück
            </span>
        </NuxtLink>
    </div>

</template>
<script setup lang="ts">
const props = defineProps(['path'])
</script>