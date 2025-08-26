#!/bin/bash

# Script de extracción automática de Contentful
# Reemplaza TU_SPACE_ID con tu ID real

SPACE_ID="TU_SPACE_ID"
OUTPUT_DIR="contentful-data"

echo "🚀 Iniciando extracción de datos de Contentful..."

# Crear directorio de salida
mkdir -p $OUTPUT_DIR

# 1. Extraer todos los proyectos
echo "📁 Extrayendo proyectos..."
contentful entry list --space-id $SPACE_ID --content-type project --output json > $OUTPUT_DIR/projects-raw.json

# 2. Extraer esquema del tipo de contenido
echo "📋 Extrayendo esquema..."
contentful content-type show --space-id $SPACE_ID --id project --output json > $OUTPUT_DIR/project-schema.json

# 3. Extraer tipos de contenido disponibles
echo "🏷️ Extrayendo tipos de contenido..."
contentful content-type list --space-id $SPACE_ID --output json > $OUTPUT_DIR/content-types.json

# 4. Extraer un proyecto de ejemplo (si hay proyectos)
echo "📝 Extrayendo proyecto de ejemplo..."
if [ -s $OUTPUT_DIR/projects-raw.json ]; then
    # Obtener el primer ID de proyecto
    FIRST_ID=$(cat $OUTPUT_DIR/projects-raw.json | grep -o '"sys":{"id":"[^"]*"' | head -1 | cut -d'"' -f6)
    if [ ! -z "$FIRST_ID" ]; then
        contentful entry show --space-id $SPACE_ID --entry-id $FIRST_ID --output json > $OUTPUT_DIR/project-example.json
        echo "✅ Proyecto de ejemplo extraído: $FIRST_ID"
    fi
fi

echo "✅ Extracción completada en el directorio: $OUTPUT_DIR"
echo "📊 Archivos generados:"
ls -la $OUTPUT_DIR/
