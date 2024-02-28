import { UnitPriceTypeEnum } from 'generated/graphql'

export const getUnitPriceTypeLabel = (unitPriceType: UnitPriceTypeEnum) => {
  return {
    [UnitPriceTypeEnum.HOURLY]: 'Pe ora',
    [UnitPriceTypeEnum.FIXED]: 'Fix',
  }[unitPriceType]
}

export const getServiceCategoryLabel = (categoryCode: string) => {
  return {
    hr: 'Resurse Umane',
    accounting: 'Contabilitate',
  }[categoryCode]
}
