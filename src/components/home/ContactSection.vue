<script setup>
import { computed, ref } from 'vue';
import { ArrowTopRightOnSquareIcon, CheckIcon, ClipboardDocumentIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';
import SectionHeader from '@/components/SectionHeader.vue';
import * as perfilPt from '@/data/perfil';
import * as perfilEn from '@/data/perfil.en';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';
import { msg } from '@/plugins/msg';

const { porIdioma } = useIdioma();
const t = computed(() => porIdioma(ui).home);
const contatos = computed(() => porIdioma({ pt: perfilPt, en: perfilEn }).contatos);

const copiado = ref(false);
let timerCopiado = null;

const copiarEmail = async valor => {
    let sucesso = false;
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(valor);
            sucesso = true;
        }
    } catch {
        sucesso = false;
    }

    if (!sucesso) {
        const textarea = document.createElement('textarea');
        textarea.value = valor;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        sucesso = document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    if (sucesso) {
        copiado.value = true;
        clearTimeout(timerCopiado);
        timerCopiado = setTimeout(() => {
            copiado.value = false;
        }, 2500);
        msg.success(t.value.emailCopiado);
    }
};

const tipoContato = c => {
    if (c.href.startsWith('mailto:')) return 'email';
    if (c.href.includes('linkedin')) return 'linkedin';
    if (c.href.includes('github')) return 'github';
    if (c.href.includes('wa.me')) return 'whatsapp';
    return 'link';
};
</script>

<template>
    <section
        id="contato"
        aria-labelledby="titulo-contato"
        class="scroll-section border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-20 lg:py-28"
    >
        <div class="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
                id="titulo-contato"
                :eyebrow="t.eyebrows.contato"
                :title="t.contato"
                :subtitle="t.contatoSub"
            />

            <div class="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                    v-for="(c, i) in contatos"
                    :key="i"
                    v-reveal="{ delay: i * 0.06 }"
                    class="group relative flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-5 transition hover:border-[var(--accent)]/50 hover:shadow-sm"
                >
                    <a
                        :href="c.href"
                        :target="c.href.startsWith('mailto:') ? undefined : '_blank'"
                        :rel="c.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'"
                        class="flex min-w-0 items-start gap-3.5 focus:outline-none"
                    >
                        <div
                            class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--accent)]"
                        >
                            <EnvelopeIcon v-if="tipoContato(c) === 'email'" class="size-5" aria-hidden="true" />
                            <svg
                                v-else-if="tipoContato(c) === 'linkedin'"
                                class="size-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                                />
                            </svg>
                            <svg
                                v-else-if="tipoContato(c) === 'github'"
                                class="size-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
                                />
                            </svg>
                            <svg
                                v-else
                                class="size-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m5.81 14.08c-.24.68-1.41 1.31-1.95 1.39c-.51.08-1.15.11-1.85-.12c-.42-.14-.97-.32-1.67-.62c-2.94-1.27-4.86-4.23-5.01-4.43c-.15-.2-1.2-1.6-1.2-3.05c0-1.45.76-2.16 1.03-2.46c.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51c.24.59.84 2.04.91 2.19c.07.15.12.32.02.52c-.1.2-.15.32-.3.5c-.15.17-.31.38-.44.51c-.15.15-.3.31-.13.61c.17.3.76 1.26 1.64 2.04c1.13 1 2.08 1.31 2.38 1.46c.3.15.47.13.65-.08c.18-.2.75-.87.95-1.17c.2-.3.4-.25.67-.15c.27.1 1.72.81 2.02.96c.3.15.5.22.57.34c.07.12.07.7-.17 1.38z"
                                />
                            </svg>
                        </div>

                        <div class="min-w-0 flex-1">
                            <div class="flex items-center justify-between gap-2">
                                <span class="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                                    {{ c.nome }}
                                </span>
                                <ArrowTopRightOnSquareIcon
                                    v-if="!c.href.startsWith('mailto:')"
                                    class="size-4 shrink-0 text-[var(--text-muted)] transition group-hover:text-[var(--accent)]"
                                    aria-hidden="true"
                                />
                            </div>
                            <span class="mt-1 block break-words text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                                {{ c.valor }}
                            </span>
                        </div>
                    </a>

                    <div v-if="c.href.startsWith('mailto:')" class="flex justify-end pl-[3.375rem]">
                        <button
                            type="button"
                            @click.prevent="copiarEmail(c.valor)"
                            class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            :aria-label="copiado ? t.emailCopiado : t.copiarEmail"
                        >
                            <CheckIcon v-if="copiado" class="size-3.5 text-emerald-500" aria-hidden="true" />
                            <ClipboardDocumentIcon v-else class="size-3.5" aria-hidden="true" />
                            <span>{{ copiado ? t.emailCopiado : t.copiarEmail }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
