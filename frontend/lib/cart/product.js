import { buildProductPath } from '@/services/products'

function asResolvedObject(value) {
  return value && typeof value === 'object' ? value : null
}

function getVariantList(product) {
  const variants = product?.variants

  if (Array.isArray(variants)) {
    return variants.map(asResolvedObject).filter(Boolean)
  }

  if (Array.isArray(variants?.docs)) {
    return variants.docs.map(asResolvedObject).filter(Boolean)
  }

  return []
}

function getVariantOptionList(variant) {
  if (!Array.isArray(variant?.options)) return []

  return variant.options
    .map((option) => {
      const resolved = asResolvedObject(option)
      if (!resolved) return null

      const variantType = asResolvedObject(resolved.variantType)

      return {
        id: resolved.id,
        label: resolved.label ?? resolved.value ?? `Opcija ${resolved.id}`,
        value: resolved.value ?? resolved.label ?? `option-${resolved.id}`,
        typeId: variantType?.id ?? resolved.variantType ?? null,
        typeLabel: variantType?.label ?? 'Opcija',
        typeName: variantType?.name ?? 'option',
      }
    })
    .filter(Boolean)
}

function getGalleryImageForOptionIds(product, optionIds = []) {
  const gallery = Array.isArray(product?.gallery) ? product.gallery : []

  const match = gallery.find((item) => {
    const variantOption = asResolvedObject(item?.variantOption)
    if (variantOption) return optionIds.includes(variantOption.id)
    return optionIds.includes(item?.variantOption)
  })

  const image = match?.image ?? gallery[0]?.image ?? null

  if (image && typeof image === 'object') {
    return {
      url: image.url ?? null,
      alt: image.alt ?? product?.title ?? '',
      width: image.width ?? null,
      height: image.height ?? null,
    }
  }

  return null
}

function getBaseProductPrice(product) {
  if (typeof product?.salePrice === 'number') return product.salePrice
  return typeof product?.price === 'number' ? product.price : 0
}

export function productHasVariants(product) {
  return Boolean(product?.enableVariants && getVariantList(product).length)
}

export function getProductOptionGroups(product) {
  const variants = getVariantList(product)
  const variantTypes = Array.isArray(product?.variantTypes)
    ? product.variantTypes.map(asResolvedObject).filter(Boolean)
    : []
  const groupsById = new Map()
  const typeOrder = []

  variantTypes.forEach((variantType) => {
    groupsById.set(variantType.id, {
      id: variantType.id,
      name: variantType.name ?? `option-${variantType.id}`,
      label: variantType.label ?? 'Opcija',
      options: [],
    })
    typeOrder.push(variantType.id)
  })

  variants.forEach((variant) => {
    getVariantOptionList(variant).forEach((option) => {
      const typeId = option.typeId ?? `unknown-${option.id}`

      if (!groupsById.has(typeId)) {
        groupsById.set(typeId, {
          id: typeId,
          name: option.typeName ?? `option-${typeId}`,
          label: option.typeLabel ?? 'Opcija',
          options: [],
        })
        typeOrder.push(typeId)
      }

      const group = groupsById.get(typeId)
      if (!group.options.some((existing) => existing.id === option.id)) {
        group.options.push(option)
      }
    })
  })

  return typeOrder
    .map((typeId) => groupsById.get(typeId))
    .filter(Boolean)
    .filter((group) => group.options.length > 0)
}

export function getSelectedVariant(product, selectedOptionIds = []) {
  if (!productHasVariants(product)) return null

  const normalizedSelection = [...selectedOptionIds].map(String).sort()

  return (
    getVariantList(product).find((variant) => {
      const variantOptionIds = getVariantOptionList(variant)
        .map((option) => String(option.id))
        .sort()

      if (variantOptionIds.length !== normalizedSelection.length) return false

      return variantOptionIds.every((optionId, index) => optionId === normalizedSelection[index])
    }) ?? null
  )
}

export function isOptionAvailableForSelection(product, groupId, optionId, selectedOptionIds = []) {
  const comparisonSet = new Set(
    selectedOptionIds
      .filter((selectedId) => {
        const selectedGroup = getProductOptionGroups(product)
          .find((group) => group.options.some((option) => String(option.id) === String(selectedId)))
        return selectedGroup?.id !== groupId
      })
      .map(String),
  )

  return getVariantList(product).some((variant) => {
    const variantOptions = getVariantOptionList(variant)
    const variantOptionIds = new Set(variantOptions.map((option) => String(option.id)))

    if (!variantOptionIds.has(String(optionId))) return false

    return [...comparisonSet].every((selectedId) => variantOptionIds.has(selectedId))
  })
}

export function getSelectedOptionIds(variant) {
  return getVariantOptionList(variant).map((option) => option.id)
}

export function getDisplayPrice(product, variant) {
  if (variant && typeof variant.price === 'number') return variant.price
  if (variant && typeof variant.salePrice === 'number') return variant.salePrice

  return getBaseProductPrice(product)
}

export function getCartItemKey(productId, variantId, selectedOptions = []) {
  if (variantId) return `product:${productId}:variant:${variantId}`

  const optionKey = selectedOptions
    .map((option) => String(option.id))
    .sort()
    .join('.')

  return `product:${productId}:${optionKey || 'base'}`
}

export function createCartItem(product, variant, quantity = 1) {
  const selectedOptions = variant ? getVariantOptionList(variant) : []
  const image = getGalleryImageForOptionIds(
    product,
    selectedOptions.map((option) => option.id),
  )

  return {
    key: getCartItemKey(product.id, variant?.id ?? null, selectedOptions),
    productId: product.id,
    productSlug: product.slug,
    productPath: buildProductPath(product),
    title: product.title,
    variantId: variant?.id ?? null,
    selectedOptions: selectedOptions.map((option) => ({
      id: option.id,
      label: option.label,
      value: option.value,
      typeId: option.typeId,
      typeLabel: option.typeLabel,
      typeName: option.typeName,
    })),
    image,
    unitPrice: getDisplayPrice(product, variant),
    quantity: Math.max(1, quantity),
    sku: product.sku ?? variant?.sku ?? null,
  }
}

export function getSelectedImage(product, selectedOptionIds = []) {
  return getGalleryImageForOptionIds(product, selectedOptionIds)
}

export function formatCartPrice(value) {
  return new Intl.NumberFormat('sr-RS').format(value ?? 0)
}

export function getCartSubtotal(items = []) {
  return items.reduce((total, item) => total + (item.unitPrice ?? 0) * (item.quantity ?? 0), 0)
}
