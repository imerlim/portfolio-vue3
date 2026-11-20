<script setup>
import { ref } from 'vue';

defineProps({
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
});

const emit = defineEmits(['update:modelValue']);
const updateValue = event => emit('update:modelValue', event.target.value);

const fieldRef = ref(null);
defineExpose({ focus: () => fieldRef.value?.focus() });
</script>

<template>
    <div class="w-full">
        <label v-if="label" :for="id" class="block mb-1 font-medium text-slate-900 dark:text-white" :class="textSize">
            {{ label }}
        </label>

        <div
            class="flex items-center w-full overflow-hidden rounded-lg px-2 bg-slate-50 dark:bg-slate-700 focus-within:ring-1"
            :class="
                error
                    ? 'border border-red-500 focus-within:ring-red-500'
                    : 'border border-slate-300 dark:border-slate-600 focus-within:ring-blue-500 focus-within:border-blue-500'
            "
        >
            <select
                :id="id"
                ref="fieldRef"
                :name="name"
                :disabled="disabled"
                :required="required"
                :value="modelValue"
                class="w-full p-2 text-slate-900 bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none border-none"
                :class="[textSize, { 'opacity-50 cursor-not-allowed': disabled }]"
                @change="updateValue"
            >
                <option value="" disabled>{{ placeholder || 'Selecione' }}</option>
                <option v-for="(option, index) in options" :key="index" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <p v-if="error && errorMessage" class="mt-1 text-red-600" :class="textSize">
            {{ errorMessage }}
        </p>
    </div>
</template>
