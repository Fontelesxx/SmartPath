"""Entrada da função serverless da SmartPath IA na Vercel."""

import sys
from pathlib import Path

# Garante que o módulo ia.py da raiz seja importado, e não este próprio arquivo.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from ia import app
