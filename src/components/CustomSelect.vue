<script setup>
import { computed, ref } from 'vue';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';

const props = defineProps({
    modelValue: [String, Number, null],
    label: String,
    id: String,
    name: String,
    placeholder: String,
    disabled: Boolean,
    required: Boolean,
    options: { type: Array, required: true },
    error: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
    textSize: { type: String, default: 'text-base' },
    embedded: { type: Boolean, default: false },
    ariaLabel: String,
});

const emit = defineEmits(['update:modelValue']);
const updateValue = event => emit('update:modelValue', event.target.value);

const { porIdioma } = useIdioma();
const placeholderTexto = computed(() => props.placeholder || porIdioma(ui).select.selecione);

const fieldRef = ref(null);
defineExpose({ focus: () => fieldRef.value?.focus() });
</script>

<template>
    <div class="w-full">
        <label v-if="label" :for="id" class="mb-1.5 block font-medium text-[var(--text-primary)]" :class="textSize">
            {{ label }}
        </label>

        <div
            class="flex w-full items-center overflow-hidden transition-colors"
            :class="
                embedded
                    ? 'rounded-none border-l border-[var(--border-subtle)] bg-transparent px-1'
                    : [
                          'rounded-lg border bg-[var(--bg-surface)] px-2',
                          error
                              ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20'
                              : 'border-[var(--border-strong)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/20',
                      ]
            "
        >
            <select
                :id="id"
                ref="fieldRef"
                :name="name"
                :aria-label="ariaLabel"
                :disabled="disabled"
                :required="required"
                :value="modelValue"
                class="w-full border-none bg-transparent p-2 text-[var(--text-primary)] focus:outline-none dark:[color-scheme:dark]"
                :class="[textSize, { 'cursor-not-allowed opacity-50': disabled }]"
                @change="updateValue"
            >
                <option value="" disabled>{{ placeholderTexto }}</option>
                <option v-for="(option, index) in options" :key="index" :value="option.value" class="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <p v-if="error && errorMessage" class="mt-1 text-red-600 dark:text-red-400" :class="textSize">
            {{ errorMessage }}
        </p>
    </div>
</template>
