// Formata número para exibição pt-BR com 2 casas (ex.: 1234.5 -> "1.234,50")
export function formatarMoeda(valor) {
    if (valor === null || valor === undefined || valor === '') return '0,00';

    let centavos;
    if (typeof valor === 'number') {
        // Arredonda para evitar problemas de ponto flutuante
        centavos = Math.round(valor * 100);
    } else {
        centavos = parseInt(String(valor).replace(/\D/g, ''), 10);
    }

    if (!Number.isFinite(centavos) || centavos === 0) return '0,00';

    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(centavos / 100);
}

// Formata como moeda BRL (ex.: "R$ 1.234,56")
export function formatarBRL(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
