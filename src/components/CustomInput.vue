<script setup>
import { ref } from 'vue';
import { formatarMoeda } from '@/utils/formatters';

const props = defineProps({
    modelValue: [String, Number],
    label: String,
    id: String,
    name: String,
    autocomplete: String,
    inputmode: String,
    type: { type: String, default: 'text' },
    placeholder: String,
    disabled: Boolean,
    required: Boolean,
    maxlength: [Number, String],
    prepend: String,
    append: String,
    error: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
    propLargeAppend: { type: Boolean, default: false },
    textSize: { type: String, default: 'text-base' },
    // Quando true, trata a digitação como valor monetário/decimal pt-BR (ex.: "150" -> 1,50)
    formata: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

function updateValue(e) {
    const inputVal = e.target.value;

    if (props.formata) {
        // Mantém apenas dígitos e converte em decimal com 2 casas
        const onlyNumbers = inputVal.replace(/\D/g, '');
        const numericValue = onlyNumbers ? parseInt(onlyNumbers, 10) / 100 : 0;
        emit('update:modelValue', numericValue);
        // Força o valor exibido a ficar formatado (bloqueia letras)
        e.target.value = formatarMoeda(numericValue);
    } else {
        emit('update:modelValue', inputVal);
    }
}

const fieldRef = ref(null);
defineExpose({ focus: () => fieldRef.value?.focus() });
</script>

<template>
    <div class="w-full">
        <label v-if="label" :for="id" class="mb-1.5 block font-medium text-[var(--text-primary)]" :class="textSize">
            {{ label }}
        </label>

        <div
            class="flex w-full items-center overflow-hidden rounded-lg border bg-[var(--bg-surface)] transition-colors"
            :class="[
                propLargeAppend ? 'px-0' : 'px-2.5',
                error
                    ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20'
                    : 'border-[var(--border-strong)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/20',
            ]"
        >
            <div
                v-if="$slots.prepend || prepend"
                class="flex select-none items-center gap-1 text-[var(--text-muted)]"
                :class="[textSize, propLargeAppend ? 'pl-2.5' : '']"
            >
                <slot name="prepend">{{ prepend }}</slot>
            </div>

            <input
                ref="fieldRef"
                :id="id"
                :name="name"
                :type="type"
                :autofocus="autofocus"
                :inputmode="formata ? 'numeric' : inputmode"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                :maxlength="maxlength"
                :autocomplete="autocomplete"
                :value="formata ? formatarMoeda(modelValue) : modelValue"
                @input="updateValue"
                @focus="$event.target.select()"
                class="w-full min-w-0 border-none bg-transparent p-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                :class="[
                    textSize,
                    { 'font-mono tabular-nums': formata || type === 'number' },
                    { 'cursor-not-allowed opacity-50': disabled },
                ]"
            />

            <div
                v-if="$slots.append || append"
                class="flex items-center justify-end gap-1 text-[var(--text-muted)]"
                :class="[textSize, propLargeAppend ? 'w-28 shrink-0' : 'w-5']"
            >
                <slot name="append">{{ append }}</slot>
            </div>
        </div>

        <p v-if="error && errorMessage" class="mt-1 text-red-600 dark:text-red-400" :class="textSize">
            {{ errorMessage }}
        </p>
    </div>
</template>
