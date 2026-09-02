import { describe, it, expect } from 'vitest';
import { validarSenha, validarTituloChamado, validarEmailDuplicado } from './validadores.js';

describe('Testes Unitários — Módulo de Validadores (Aula Prática SENAI)', () => {

    // -------------------------------------------------------------
    // 1. REGRA: Senha Mínima de 6 Caracteres (RF-002)
    // -------------------------------------------------------------
    describe('validarSenha() — Partição de Equivalência e Valor Limite (BVA)', () => {
        
        it('deve retornar FALSE para senha vazia ou nula (Classe Inválida)', () => {
            expect(validarSenha('')).toBe(false);
            expect(validarSenha(null)).toBe(false);
        });

        it('deve retornar FALSE para senha com 5 caracteres (Valor Limite - Abaixo)', () => {
            // Análise de Valor Limite: 5 caracteres é imediatamente abaixo do limite 6
            expect(validarSenha('12345')).toBe(false);
        });

        it('deve retornar TRUE para senha com 6 caracteres (Valor Limite - No Limite)', () => {
            // Análise de Valor Limite: 6 caracteres é a fronteira exata válida
            expect(validarSenha('123456')).toBe(true);
        });

        it('deve retornar TRUE para senha com 7 caracteres (Valor Limite - Acima)', () => {
            // Análise de Valor Limite: 7 caracteres é imediatamente acima do limite 6
            expect(validarSenha('1234567')).toBe(true);
        });

        it('deve retornar TRUE para senha longa com 12 caracteres (Classe Válida)', () => {
            expect(validarSenha('SenhaForte123')).toBe(true);
        });
    });

    // -------------------------------------------------------------
    // 2. REGRA: Título do Chamado Mínimo de 5 Caracteres (RF-003)
    // -------------------------------------------------------------
    describe('validarTituloChamado() — Partição de Equivalência e BVA', () => {
        
        it('deve retornar FALSE para título com 4 caracteres (Valor Limite - Abaixo)', () => {
            // Ex: "Rede" possui 4 caracteres
            expect(validarTituloChamado('Rede')).toBe(false);
        });

        it('deve retornar TRUE para título com 5 caracteres (Valor Limite - No Limite)', () => {
            // Ex: "Mouse" possui 5 caracteres
            expect(validarTituloChamado('Mouse')).toBe(true);
        });

        it('deve retornar TRUE para título com 6 caracteres (Valor Limite - Acima)', () => {
            // Ex: "Teclas" possui 6 caracteres
            expect(validarTituloChamado('Teclas')).toBe(true);
        });

        it('deve retornar FALSE para título em branco ou apenas espaços (Classe Inválida)', () => {
            expect(validarTituloChamado('   ')).toBe(false);
        });
    });

    // -------------------------------------------------------------
    // 3. REGRA: E-mail Duplicado (RF-002)
    // -------------------------------------------------------------
    describe('validarEmailDuplicado() — Verificação de Duplicidade', () => {
        const usuariosMock = [
            { id: 1, email: 'aluno@senai.br' },
            { id: 2, email: 'usuario.teste@senai.br' }
        ];

        it('deve identificar e-mail duplicado de forma case-insensitive (Comportamento Correto)', () => {
            // "Aluno@senai.br" deve ser considerado duplicado de "aluno@senai.br"
            const duplicado = validarEmailDuplicado('Aluno@senai.br', usuariosMock, false);
            expect(duplicado).toBe(true);
        });

        it('deve permitir e-mail novo e não cadastrado', () => {
            const duplicado = validarEmailDuplicado('novo.aluno@senai.br', usuariosMock, false);
            expect(duplicado).toBe(false);
        });
    });
});
