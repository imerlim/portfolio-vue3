<template>
    <div class="bg-slate-100 dark:bg-slate-900">
        <div class="relative isolate overflow-hidden text-white bg-slate-100 dark:bg-slate-900 min-h-screen py-5 sm:px-5 sm:py-2">
            <div class="container mx-auto sm:px-16">
                <div class="grid grid-cols-1 gap-x-8 gap-y-8 px-4 py-11 sm:grid-cols-2 sm:px-6 lg:grid-cols-6 lg:px-8">
                    <div class="col-span-1 sm:col-span-2 lg:col-span-6 text-xl">
                        <h1 class="text-slate-900 dark:text-white">{{ tituloMargem }}</h1>
                    </div>

                    <div class="col-span-1">
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

                    <div class="col-span-1 sm:col-start-1">
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
                            <template #prepend><span class="text-base">R$</span></template>
                        </CustomInput>
                    </div>

                    <div class="col-span-1">
                        <CustomInput
                            placeholder="0,00"
                            @change="calculaPrecoVenda()"
                            :formata="true"
                            v-model="margem"
                            :label="t.margem"
                            id="margem"
                            name="margem"
                        >
                            <template #append><span class="text-base">%</span></template>
                        </CustomInput>
                    </div>

                    <div class="col-span-1">
                        <CustomInput
                            placeholder="0,00"
                            @change="calculaMargens()"
                            :formata="true"
                            v-model="precoVenda"
                            :label="t.precoVenda"
                            id="precoVenda"
                            name="precoVenda"
                        >
                            <template #prepend><span class="text-base">R$</span></template>
                        </CustomInput>
                    </div>

                    <div class="col-span-1">
                        <CustomInput
                            placeholder="0,00"
                            @change="discount()"
                            :formata="true"
                            v-model="taxaDesconto"
                            :label="t.taxaDesconto"
                            id="taxaDesconto"
                            name="taxaDesconto"
                            :title="t.taxaDescontoTitle"
                        >
                            <template #append><span class="text-base">%</span></template>
                        </CustomInput>
                    </div>

                    <div class="col-span-1">
                        <CustomInput disabled v-model="lucro" :formata="true" :label="t.lucro" id="lucro" name="lucro">
                            <template #prepend><span class="text-base">R$</span></template>
                        </CustomInput>
                    </div>

                    <div class="col-span-1">
                        <CustomInput
                            disabled
                            v-model="margemLiquida"
                            :formata="true"
                            :label="t.margemLiquida"
                            id="margemLiquida"
                            name="margemLiquida"
                        >
                            <template #append><span class="text-base">%</span></template>
                        </CustomInput>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import { ui } from '@/data/ui';
import { porIdioma } from '@/composables/useIdioma';

// Cálculo 100% no navegador — sem backend.
export default {
    name: 'CalculadoraMargem',
    components: { CustomInput, CustomSelect },

    computed: {
        // Textos no idioma ativo (reativo ao estado global de useIdioma)
        t() {
            return porIdioma(ui).margem;
        },
        tituloMargem() {
            return this.selectTipoMargem === 'mlc' ? this.t.tituloCusto : this.t.tituloVenda;
        },
    },

    data() {
        return {
            selectTipoMargem: 'mlv',
            custo: null,
            margem: null,
            precoVenda: null,
            lucro: null,
            taxaDesconto: null,
            margemLiquida: null,
        };
    },

    methods: {
        mudaTipoMargem() {
            this.custo = null;
            this.margem = null;
            this.margemLiquida = null;
            this.precoVenda = null;
            this.lucro = null;
            this.taxaDesconto = null;
        },

        // Custo ou margem alterados -> calcula o preço de venda
        calculaPrecoVenda() {
            const custo = parseFloat(this.custo);
            const margem = parseFloat(this.margem);

            if (custo <= 0) {
                this.custo = null;
                return this.$msg.warning(this.t.avisos.custoMaiorZero);
            }
            if (margem <= 0) {
                this.margem = null;
                this.margemLiquida = null;
                return this.$msg.warning(this.t.avisos.margemMaiorZero);
            }
            if (this.selectTipoMargem === 'mlv' && margem >= 100) {
                this.margem = null;
                this.margemLiquida = null;
                return this.$msg.warning(this.t.avisos.margemVendaMenor100);
            }

            if (custo > 0 && margem > 0) {
                const m = margem / 100;
                const precoCalculado =
                    this.selectTipoMargem === 'mlv'
                        ? custo / (1 - m) // P.V. = Custo / (1 - MLV)
                        : custo * (1 + m); // Markup: P.V. = Custo * (1 + MLC)

                this.precoVenda = precoCalculado;
                this.lucro = precoCalculado - custo;
                this.discount();
            } else {
                this.precoVenda = null;
                this.lucro = null;
            }
        },

        // Preço de venda alterado -> calcula a margem
        calculaMargens() {
            const custo = parseFloat(this.custo);
            const precoVenda = parseFloat(this.precoVenda);

            if (!(custo > 0)) {
                this.precoVenda = null;
                return this.$msg.warning(this.t.avisos.custoMaiorZero);
            }
            if (custo > precoVenda) {
                this.precoVenda = null;
                return this.$msg.warning(this.t.avisos.vendaMaiorCusto);
            }

            if (precoVenda > custo) {
                const lucroBruto = precoVenda - custo;
                this.lucro = lucroBruto;
                // MLV = Lucro / P.V. * 100  |  MLC = Lucro / Custo * 100
                this.margem = this.selectTipoMargem === 'mlv' ? (lucroBruto / precoVenda) * 100 : (lucroBruto / custo) * 100;
                this.margemLiquida = this.margem;
                this.discount();
            } else {
                this.margem = null;
                this.margemLiquida = null;
            }
        },

        // Aplica a taxa/desconto sobre o preço de venda e calcula lucro e margem líquida
        discount() {
            const taxaInformada = parseFloat(this.taxaDesconto) / 100;
            const taxa = isNaN(taxaInformada) ? 0 : taxaInformada;
            const preco = parseFloat(this.precoVenda);
            const custo = parseFloat(this.custo);

            if (taxa >= 1) {
                this.taxaDesconto = null;
                return this.$msg.warning(this.t.avisos.taxaMenor100);
            }

            if (isNaN(preco) || preco <= 0 || isNaN(custo) || custo < 0) {
                this.lucro = 0;
                return;
            }

            const lucroBruto = preco - custo - preco * taxa;
            this.lucro = lucroBruto;
            this.margemLiquida = this.selectTipoMargem === 'mlv' ? (lucroBruto / preco) * 100 : (lucroBruto / custo) * 100;
        },
    },
};
</script>
