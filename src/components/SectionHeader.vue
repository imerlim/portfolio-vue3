<script setup>
defineProps({
    id: String,
    eyebrow: String,
    title: String,
    subtitle: String,
    align: { type: String, default: 'center' },
});
</script>

<template>
    <div :class="align === 'center' ? 'text-center' : 'text-left'">
        <p v-if="eyebrow" class="font-mono text-xs font-semibold tracking-widest uppercase text-[var(--accent)]">
            {{ eyebrow }}
        </p>
        <h2
            :id="id"
            class="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl text-balance"
        >
            {{ title }}
        </h2>
        <p
            v-if="subtitle"
            class="mt-4 text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl"
            :class="align === 'center' ? 'mx-auto' : ''"
        >
            {{ subtitle }}
        </p>
    </div>
</template>
