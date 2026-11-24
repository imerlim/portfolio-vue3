<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CustomInput from '@/components/CustomInput.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import { ui } from '@/data/ui';
import { porIdioma } from '@/composables/useIdioma';
import { formatarBRL, formatarMoeda } from '@/utils/formatters';
import { msg } from '@/plugins/msg';

// Cálculo 100% no navegador — sem backend.
const t = computed(() => porIdioma(ui).margem);

const selectTipoMargem = ref('mlv');
const custo = ref(null);
const margem = ref(null);
const precoVenda = ref(null);
const lucro = ref(null);
const taxaDesconto = ref(null);
const margemLiquida = ref(null);

const tituloMargem = computed(() => (selectTipoMargem.value === 'mlc' ? t.value.tituloCusto : t.value.tituloVenda));
const formulaAtiva = computed(() => (selectTipoMargem.value === 'mlc' ? t.value.formulaMlc : t.value.formulaMlv));

const temResultado = computed(() => Number(precoVenda.value) > 0 && Number(custo.value) > 0);
const lucroPositivo = computed(() => Number(lucro.value) > 0);

const composicao = computed(() => {
    const preco = Number(precoVenda.value) || 0;
    const custoVal = Number(custo.value) || 0;
    if (preco <= 0 || custoVal <= 0) {
        return { custoPct: 0, taxaPct: 0, lucroPct: 0, barCusto: 0, barTaxa: 0, barLucro: 0 };
    }

    const taxa = Number(taxaDesconto.value) || 0;
    const taxaVal = preco * (taxa / 100);
    const lucroVal = Number(lucro.value) || 0;

    const custoPct = (custoVal / preco) * 100;
    const taxaPct = (taxaVal / preco) * 100;
    const lucroPct = (lucroVal / preco) * 100;

    const lucroBarra = Math.max(0, lucroPct);
    const totalBarra = custoPct + taxaPct + lucroBarra || 1;

    return {
        custoPct,
        taxaPct,
        lucroPct,
        barCusto: (custoPct / totalBarra) * 100,
        barTaxa: (taxaPct / totalBarra) * 100,
        barLucro: (lucroBarra / totalBarra) * 100,
    };
});

function limparCampos() {
    custo.value = null;
    margem.value = null;
    margemLiquida.value = null;
    precoVenda.value = null;
    lucro.value = null;
    taxaDesconto.value = null;
}

function mudaTipoMargem() {
    limparCampos();
}

// Custo ou margem alterados -> calcula o preço de venda
function calculaPrecoVenda() {
    const custoNum = parseFloat(custo.value);
    const margemNum = parseFloat(margem.value);

    if (custoNum <= 0) {
        custo.value = null;
        return msg.warning(t.value.avisos.custoMaiorZero);
    }
    if (margemNum <= 0) {
        margem.value = null;
        margemLiquida.value = null;
        return msg.warning(t.value.avisos.margemMaiorZero);
    }
    if (selectTipoMargem.value === 'mlv' && margemNum >= 100) {
        margem.value = null;
        margemLiquida.value = null;
        return msg.warning(t.value.avisos.margemVendaMenor100);
    }

    if (custoNum > 0 && margemNum > 0) {
        const m = margemNum / 100;
        const precoCalculado =
            selectTipoMargem.value === 'mlv'
                ? custoNum / (1 - m) // P.V. = Custo / (1 - MLV)
                : custoNum * (1 + m); // Markup: P.V. = Custo * (1 + MLC)

        precoVenda.value = precoCalculado;
        lucro.value = precoCalculado - custoNum;
        discount();
    } else {
        precoVenda.value = null;
        lucro.value = null;
    }
}

// Preço de venda alterado -> calcula a margem
function calculaMargens() {
    const custoNum = parseFloat(custo.value);
    const precoVendaNum = parseFloat(precoVenda.value);

    if (!(custoNum > 0)) {
        precoVenda.value = null;
        return msg.warning(t.value.avisos.custoMaiorZero);
    }
    if (custoNum > precoVendaNum) {
        precoVenda.value = null;
        return msg.warning(t.value.avisos.vendaMaiorCusto);
    }

    if (precoVendaNum > custoNum) {
        const lucroBruto = precoVendaNum - custoNum;
        lucro.value = lucroBruto;
        // MLV = Lucro / P.V. * 100  |  MLC = Lucro / Custo * 100
        margem.value =
            selectTipoMargem.value === 'mlv' ? (lucroBruto / precoVendaNum) * 100 : (lucroBruto / custoNum) * 100;
        margemLiquida.value = margem.value;
        discount();
    } else {
        margem.value = null;
        margemLiquida.value = null;
    }
}

// Aplica a taxa/desconto sobre o preço de venda e calcula lucro e margem líquida
function discount() {
    const taxaInformada = parseFloat(taxaDesconto.value) / 100;
    const taxa = isNaN(taxaInformada) ? 0 : taxaInformada;
    const preco = parseFloat(precoVenda.value);
    const custoNum = parseFloat(custo.value);

    if (taxa >= 1) {
        taxaDesconto.value = null;
        return msg.warning(t.value.avisos.taxaMenor100);
    }

    if (isNaN(preco) || preco <= 0 || isNaN(custoNum) || custoNum < 0) {
        lucro.value = 0;
        return;
    }

    const lucroBruto = preco - custoNum - preco * taxa;
    lucro.value = lucroBruto;
    margemLiquida.value =
        selectTipoMargem.value === 'mlv' ? (lucroBruto / preco) * 100 : (lucroBruto / custoNum) * 100;
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
                        to="/calculadora-juros-compostos"
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
                    {{ tituloMargem }}
                </h1>
                <p class="mt-2 max-w-2xl text-base text-[var(--text-secondary)]">
                    {{ t.intro }}
                </p>
                <div
                    class="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3.5 py-1.5 font-mono text-xs text-[var(--text-secondary)]"
                >
                    <span class="font-semibold text-[var(--accent)]">{{ t.formulaAtiva }}:</span>
                    <span>{{ formulaAtiva }}</span>
                </div>
            </header>

            <div class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <section
                    class="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8"
                >
                    <form @submit.prevent class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div class="sm:col-span-2">
                            <CustomSelect
                                @change="mudaTipoMargem()"
                                v-model="selectTipoMargem"
                                id="selectTipoMargem"
                                name="selectTipoMargem"
                                :label="t.tipoMargem"
                                :options="[
                                    { label: t.opcaoVenda, value: 'mlv' },
                                    { label: t.opcaoCusto, value: 'mlc' },
                                ]"
                            />
                        </div>

                        <div>
                            <CustomInput
                                placeholder="0,00"
                                @change="calculaPrecoVenda()"
                                :formata="true"
                                v-model="custo"
                                :label="t.custo"
                                id="custo"
                                name="custo"
                                maxlength="10"
                            >
                                <template #prepend><span class="text-sm font-mono">R$</span></template>
                            </CustomInput>
                        </div>

                        <div>
                            <CustomInput
                                placeholder="0,00"
                                @change="calculaPrecoVenda()"
                                :formata="true"
                                v-model="margem"
                                :label="t.margem"
                                id="margem"
                                name="margem"
                            >
                                <template #append><span class="text-sm font-mono">%</span></template>
                            </CustomInput>
                        </div>

                        <div>
                            <CustomInput
                                placeholder="0,00"
                                @change="calculaMargens()"
                                :formata="true"
                                v-model="precoVenda"
                                :label="t.precoVenda"
                                id="precoVenda"
                                name="precoVenda"
                            >
                                <template #prepend><span class="text-sm font-mono">R$</span></template>
                            </CustomInput>
                        </div>

                        <div>
                            <CustomInput
                                placeholder="0,00"
                                @change="discount()"
                                :formata="true"
                                v-model="taxaDesconto"
                                :label="t.taxaDesconto"
                                id="taxaDesconto"
                                name="taxaDesconto"
                            >
                                <template #append><span class="text-sm font-mono">%</span></template>
                            </CustomInput>
                            <p class="mt-1.5 text-xs text-[var(--text-muted)]">
                                {{ t.taxaDescontoTitle }}
                            </p>
                        </div>
                    </form>
                </section>

                <aside
                    aria-live="polite"
                    class="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24"
                >
                    <h2 class="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                        {{ t.painelResultado }}
                    </h2>

                    <div v-if="temResultado" class="mt-5 space-y-6">
                        <dl class="space-y-5">
                            <div class="rounded-xl bg-[var(--bg-subtle)] p-4 border border-[var(--border-subtle)]">
                                <dt class="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                                    {{ t.precoVenda }}
                                </dt>
                                <dd
                                    class="mt-1 font-display text-3xl font-bold tracking-tight tabular-nums text-[var(--accent)]"
                                >
                                    {{ formatarBRL(precoVenda) }}
                                </dd>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="rounded-xl bg-[var(--bg-subtle)] p-4 border border-[var(--border-subtle)]">
                                    <dt class="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                                        {{ t.lucro }}
                                    </dt>
                                    <dd
                                        class="mt-1 font-display text-xl sm:text-2xl font-bold tracking-tight tabular-nums"
                                        :class="
                                            lucroPositivo
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-red-600 dark:text-red-400'
                                        "
                                    >
                                        {{ formatarBRL(lucro) }}
                                    </dd>
                                </div>

                                <div class="rounded-xl bg-[var(--bg-subtle)] p-4 border border-[var(--border-subtle)]">
                                    <dt class="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                                        {{ t.margemLiquida }}
                                    </dt>
                                    <dd
                                        class="mt-1 font-display text-xl sm:text-2xl font-bold tracking-tight tabular-nums"
                                        :class="
                                            lucroPositivo
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-red-600 dark:text-red-400'
                                        "
                                    >
                                        {{ formatarMoeda(margemLiquida) }}%
                                    </dd>
                                </div>
                            </div>
                        </dl>

                        <div class="pt-2 border-t border-[var(--border-subtle)]">
                            <p class="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
                                {{ t.composicaoPreco }}
                            </p>

                            <div
                                class="flex h-3 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]"
                                role="img"
                                :aria-label="t.composicaoPreco"
                            >
                                <div
                                    class="h-full bg-slate-500 dark:bg-slate-400 transition-all duration-300"
                                    :style="{ width: `${composicao.barCusto}%` }"
                                />
                                <div
                                    v-if="composicao.barTaxa > 0"
                                    class="h-full bg-amber-500 transition-all duration-300"
                                    :style="{ width: `${composicao.barTaxa}%` }"
                                />
                                <div
                                    v-if="composicao.barLucro > 0"
                                    class="h-full bg-emerald-500 transition-all duration-300"
                                    :style="{ width: `${composicao.barLucro}%` }"
                                />
                            </div>

                            <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-[var(--text-secondary)]">
                                <li class="inline-flex items-center gap-1.5 tabular-nums">
                                    <span class="h-2.5 w-2.5 rounded-full bg-slate-500 dark:bg-slate-400" aria-hidden="true" />
                                    <span>{{ t.custoPct }}:</span>
                                    <strong class="text-[var(--text-primary)]">{{ composicao.custoPct.toFixed(1) }}%</strong>
                                </li>
                                <li v-if="composicao.taxaPct > 0" class="inline-flex items-center gap-1.5 tabular-nums">
                                    <span class="h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden="true" />
                                    <span>{{ t.taxaPct }}:</span>
                                    <strong class="text-[var(--text-primary)]">{{ composicao.taxaPct.toFixed(1) }}%</strong>
                                </li>
                                <li class="inline-flex items-center gap-1.5 tabular-nums">
                                    <span
                                        class="h-2.5 w-2.5 rounded-full"
                                        :class="lucroPositivo ? 'bg-emerald-500' : 'bg-red-500'"
                                        aria-hidden="true"
                                    />
                                    <span>{{ t.lucroPct }}:</span>
                                    <strong
                                        :class="
                                            lucroPositivo
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-red-600 dark:text-red-400'
                                        "
                                    >
                                        {{ composicao.lucroPct.toFixed(1) }}%
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
