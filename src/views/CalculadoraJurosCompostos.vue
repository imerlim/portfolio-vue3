<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CustomInput from '@/components/CustomInput.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import { formatarBRL } from '@/utils/formatters';
import { ui } from '@/data/ui';
import { porIdioma } from '@/composables/useIdioma';
import { msg } from '@/plugins/msg';

// Cálculo 100% no navegador — sem backend.
const t = computed(() => porIdioma(ui).juros);

const valorInicial = ref(null);
const valorMensal = ref(null);
const taxaJuros = ref(null);
const periodo = ref(null);
const taxaJurosSelect = ref('Mensal');
const periodoSelect = ref('Anos');

const calculado = ref(false);
const montanteFinal = ref(formatarBRL(0));
const valorTotalInvestido = ref(formatarBRL(0));
const totalEmJuros = ref(formatarBRL(0));

const investidoNum = ref(0);
const montanteNum = ref(0);
const jurosNum = ref(0);

const composicao = computed(() => {
    const total = montanteNum.value;
    if (!calculado.value || total <= 0) {
        return { investidoPct: 0, jurosPct: 0 };
    }
    const investidoPct = Math.max(0, Math.min(100, (investidoNum.value / total) * 100));
    const jurosPct = Math.max(0, 100 - investidoPct);
    return { investidoPct, jurosPct };
});

function limparCampos() {
    valorInicial.value = null;
    valorMensal.value = null;
    taxaJuros.value = null;
    periodo.value = null;
    calculado.value = false;
    investidoNum.value = 0;
    montanteNum.value = 0;
    jurosNum.value = 0;
    montanteFinal.value = formatarBRL(0);
    valorTotalInvestido.value = formatarBRL(0);
    totalEmJuros.value = formatarBRL(0);
}

function calculaJurosCompostos() {
    const C = Number(valorInicial.value) || 0; // capital inicial
    const A = Number(valorMensal.value) || 0; // aporte mensal
    const taxa = Number(taxaJuros.value) || 0;
    const periodoVal = parseFloat(periodo.value);

    if (!C && !A) {
        return msg.warning(t.value.avisos.informeValor);
    }
    if (!taxa) {
        return msg.warning(t.value.avisos.informeTaxa);
    }
    if (!(periodoVal > 0)) {
        return msg.warning(t.value.avisos.informePeriodo);
    }

    // Taxa mensal equivalente
    const i = taxaJurosSelect.value === 'Mensal' ? taxa / 100 : Math.pow(1 + taxa / 100, 1 / 12) - 1;
    // Período em meses
    const meses = periodoSelect.value === 'Anos' ? periodoVal * 12 : periodoVal;

    // M = C(1+i)^t + A * [((1+i)^t - 1) / i]
    const fator = Math.pow(1 + i, meses);
    const M = C * fator + A * ((fator - 1) / i);
    const investido = C + A * meses;
    const juros = Number.isFinite(M) ? M - investido : 0;

    montanteNum.value = Number.isFinite(M) ? M : 0;
    investidoNum.value = investido;
    jurosNum.value = juros;

    montanteFinal.value = formatarBRL(montanteNum.value);
    valorTotalInvestido.value = formatarBRL(investido);
    totalEmJuros.value = formatarBRL(juros);
    calculado.value = Number.isFinite(M);
}
</script>

<template>
    <div class="bg-[var(--bg-canvas)] min-h-[calc(100svh-4rem)] py-10 lg:py-16">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
                <RouterLink
                    to="/"
                    class="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                >
                    <span aria-hidden="true">←</span>
                    {{ t.voltarInicio }}
                </RouterLink>

                <div class="flex flex-wrap items-center gap-2">
                    <RouterLink
                        to="/calculadora-margem"
                        class="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                        {{ t.outraFerramenta }}
                        <span aria-hidden="true">→</span>
                    </RouterLink>

                    <button
                        type="button"
                        @click="limparCampos"
                        class="inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                    >
                        {{ t.limpar }}
                    </button>
                </div>
            </div>

            <header>
                <h1 class="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                    {{ t.titulo }}
                </h1>
                <p class="mt-2 max-w-2xl text-base text-[var(--text-secondary)]">
                    {{ t.intro }}
                </p>
            </header>

            <div class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <section
                    class="lg:col-span-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8"
                >
                    <form @submit.prevent="calculaJurosCompostos" class="space-y-5">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <CustomInput
                                placeholder="0,00"
                                :formata="true"
                                v-model="valorInicial"
                                :label="t.valorInicial"
                                id="valorInicial"
                                name="valorInicial"
                            >
                                <template #prepend><span class="text-sm font-mono">R$</span></template>
                            </CustomInput>

                            <CustomInput
                                placeholder="0,00"
                                :formata="true"
                                v-model="valorMensal"
                                :label="t.aporteMensal"
                                id="valorMensal"
                                name="valorMensal"
                            >
                                <template #prepend><span class="text-sm font-mono">R$</span></template>
                            </CustomInput>

                            <CustomInput
                                placeholder="0,00"
                                :formata="true"
                                :propLargeAppend="true"
                                v-model="taxaJuros"
                                :label="t.taxaJuros"
                                id="taxaJuros"
                                name="taxaJuros"
                            >
                                <template #append>
                                    <CustomSelect
                                        :embedded="true"
                                        :ariaLabel="t.taxaTipoAria"
                                        :options="[
                                            { label: t.mensal, value: 'Mensal' },
                                            { label: t.anual, value: 'Anual' },
                                        ]"
                                        v-model="taxaJurosSelect"
                                        id="taxaJurosSelect"
                                        name="taxaJurosSelect"
                                    />
                                </template>
                            </CustomInput>

                            <CustomInput
                                type="number"
                                inputmode="numeric"
                                placeholder="0"
                                :propLargeAppend="true"
                                v-model="periodo"
                                :label="t.periodo"
                                id="periodo"
                                name="periodo"
                            >
                                <template #append>
                                    <CustomSelect
                                        :embedded="true"
                                        :ariaLabel="t.periodoTipoAria"
                                        :options="[
                                            { label: t.anos, value: 'Anos' },
                                            { label: t.meses, value: 'Meses' },
                                        ]"
                                        v-model="periodoSelect"
                                        id="periodoSelect"
                                        name="periodoSelect"
                                    />
                                </template>
                            </CustomInput>
                        </div>

                        <div class="pt-2 flex justify-end">
                            <button
                                type="submit"
                                class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-[var(--accent-strong)] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                            >
                                {{ t.calcular }}
                            </button>
                        </div>
                    </form>
                </section>

                <aside
                    aria-live="polite"
                    class="lg:col-span-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24"
                >
                    <h2 class="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                        {{ t.painelResultado }}
                    </h2>

                    <div v-if="calculado" class="mt-5 space-y-6">
                        <dl class="space-y-4">
                            <div class="rounded-xl bg-[var(--bg-subtle)] p-5 border border-[var(--border-subtle)]">
                                <dt class="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                                    {{ t.montanteFinal }}
                                </dt>
                                <dd
                                    class="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-[var(--accent)]"
                                >
                                    {{ montanteFinal }}
                                </dd>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="rounded-xl bg-[var(--bg-subtle)] p-4 border border-[var(--border-subtle)]">
                                    <dt class="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                                        {{ t.valorInvestido }}
                                    </dt>
                                    <dd
                                        class="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-[var(--text-primary)]"
                                    >
                                        {{ valorTotalInvestido }}
                                    </dd>
                                </div>

                                <div class="rounded-xl bg-[var(--bg-subtle)] p-4 border border-[var(--border-subtle)]">
                                    <dt class="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                                        {{ t.totalJuros }}
                                    </dt>
                                    <dd
                                        class="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400"
                                    >
                                        {{ totalEmJuros }}
                                    </dd>
                                </div>
                            </div>
                        </dl>

                        <div class="pt-2 border-t border-[var(--border-subtle)]">
                            <p class="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
                                {{ t.composicaoPatrimonio }}
                            </p>

                            <div
                                class="flex h-3 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]"
                                role="img"
                                :aria-label="t.composicaoPatrimonio"
                            >
                                <div
                                    class="h-full bg-slate-500 dark:bg-slate-400 transition-all duration-300"
                                    :style="{ width: `${composicao.investidoPct}%` }"
                                />
                                <div
                                    class="h-full bg-emerald-500 transition-all duration-300"
                                    :style="{ width: `${composicao.jurosPct}%` }"
                                />
                            </div>

                            <ul class="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-[var(--text-secondary)]">
                                <li class="inline-flex items-center gap-1.5 tabular-nums">
                                    <span class="h-2.5 w-2.5 rounded-full bg-slate-500 dark:bg-slate-400" aria-hidden="true" />
                                    <span>{{ t.investidoPct }}:</span>
                                    <strong class="text-[var(--text-primary)]">{{ composicao.investidoPct.toFixed(1) }}%</strong>
                                </li>
                                <li class="inline-flex items-center gap-1.5 tabular-nums">
                                    <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                                    <span>{{ t.jurosPct }}:</span>
                                    <strong class="text-emerald-600 dark:text-emerald-400">
                                        {{ composicao.jurosPct.toFixed(1) }}%
                                    </strong>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <p v-else class="mt-6 py-8 text-center text-sm text-[var(--text-muted)]">
                        {{ t.preenchaCampos }}
                    </p>
                </aside>
            </div>
        </div>
    </div>
</template>
