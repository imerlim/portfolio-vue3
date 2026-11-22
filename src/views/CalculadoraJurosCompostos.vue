<template>
    <div class="bg-slate-100 dark:bg-slate-900">
        <div
            class="relative isolate overflow-hidden text-white dark:text-slate-300 bg-slate-100 dark:bg-slate-900 min-h-screen pt-10 sm:px-5 sm:pt-0"
        >
            <div class="container mx-auto sm:px-16">
                <div class="grid grid-cols-1 gap-x-8 gap-y-8 px-4 py-11 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                    <div class="col-span-1 sm:col-span-2 lg:col-span-4 text-center text-2xl">
                        <h1 class="text-slate-900 dark:text-white">{{ t.titulo }}</h1>
                    </div>

                    <div v-show="calculado" class="col-span-1 sm:col-span-2 lg:col-span-4 justify-items-center">
                        <dl class="grid grid-cols-1 gap-3 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-3">
                            <div class="flex flex-col bg-slate-400/5 p-8 dark:bg-white/5">
                                <dt class="text-2xl font-semibold text-slate-900 dark:text-white">{{ t.valorInvestido }}</dt>
                                <dd class="order-first text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                    {{ valorTotalInvestido }}
                                </dd>
                            </div>
                            <div ref="montanteDiv" class="flex flex-col bg-slate-400/5 p-8 dark:bg-white/5">
                                <dt class="text-2xl font-semibold text-sky-500">{{ t.montanteFinal }}</dt>
                                <dd class="order-first text-3xl font-semibold tracking-tight text-sky-500">
                                    {{ montanteFinal }}
                                </dd>
                            </div>
                            <div class="flex flex-col bg-slate-400/5 p-8 dark:bg-white/5">
                                <dt class="text-2xl font-semibold text-slate-900 dark:text-white">{{ t.totalJuros }}</dt>
                                <dd class="order-first text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                    {{ totalEmJuros }}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div class="col-span-1">
                        <CustomInput
                            @keyup.enter="calculaJurosCompostos"
                            placeholder="0,00"
                            :formata="true"
                            v-model="valorInicial"
                            :label="t.valorInicial"
                            id="valorInicial"
                            name="valorInicial"
                        >
                            <template #prepend><span class="text-base">R$</span></template>
                        </CustomInput>
                    </div>
                    <div class="col-span-1">
                        <CustomInput
                            @keyup.enter="calculaJurosCompostos"
                            placeholder="0,00"
                            :formata="true"
                            v-model="valorMensal"
                            :label="t.aporteMensal"
                            id="valorMensal"
                            name="valorMensal"
                        >
                            <template #prepend><span class="text-base">R$</span></template>
                        </CustomInput>
                    </div>
                    <div class="col-span-1">
                        <CustomInput
                            @keyup.enter="calculaJurosCompostos"
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
                    </div>
                    <div class="col-span-1">
                        <CustomInput
                            @keyup.enter="calculaJurosCompostos"
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
                    <div class="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-end self-end mt-5">
                        <button
                            type="button"
                            class="cursor-pointer rounded-md ml-1 px-3 py-2 text-base font-semibold bg-sky-800 text-white shadow-xs hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 inline-flex"
                            @click="calculaJurosCompostos()"
                        >
                            {{ t.calcular }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import { formatarBRL } from '@/utils/formatters';
import { ui } from '@/data/ui';
import { porIdioma } from '@/composables/useIdioma';

// Cálculo 100% no navegador — sem backend.
export default {
    name: 'CalculadoraJurosCompostos',
    components: { CustomInput, CustomSelect },

    computed: {
        // Textos no idioma ativo (reativo ao estado global de useIdioma)
        t() {
            return porIdioma(ui).juros;
        },
    },

    data() {
        return {
            valorInicial: null,
            valorMensal: null,
            taxaJuros: null,
            periodo: null,
            taxaJurosSelect: 'Mensal',
            periodoSelect: 'Anos',
            calculado: false,
            montanteFinal: formatarBRL(0),
            valorTotalInvestido: formatarBRL(0),
            totalEmJuros: formatarBRL(0),
        };
    },

    methods: {
        calculaJurosCompostos() {
            const C = Number(this.valorInicial) || 0; // capital inicial
            const A = Number(this.valorMensal) || 0; // aporte mensal
            const taxa = Number(this.taxaJuros) || 0;
            const periodo = parseFloat(this.periodo);

            if (!C && !A) {
                return this.$msg.warning(this.t.avisos.informeValor);
            }
            if (!taxa) {
                return this.$msg.warning(this.t.avisos.informeTaxa);
            }
            if (!(periodo > 0)) {
                return this.$msg.warning(this.t.avisos.informePeriodo);
            }

            // Taxa mensal equivalente
            const i = this.taxaJurosSelect === 'Mensal' ? taxa / 100 : Math.pow(1 + taxa / 100, 1 / 12) - 1;
            // Período em meses
            const t = this.periodoSelect === 'Anos' ? periodo * 12 : periodo;

            // M = C(1+i)^t + A * [((1+i)^t - 1) / i]
            const fator = Math.pow(1 + i, t);
            const M = C * fator + A * ((fator - 1) / i);
            const investido = C + A * t;

            this.montanteFinal = formatarBRL(Number.isFinite(M) ? M : 0);
            this.valorTotalInvestido = formatarBRL(investido);
            this.totalEmJuros = formatarBRL(Number.isFinite(M) ? M - investido : 0);
            this.calculado = Number.isFinite(M);

            this.$nextTick(() => {
                this.$refs.montanteDiv?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        },
    },
};
</script>
