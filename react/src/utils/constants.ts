import { UnitCostTypeEnum } from 'generated/graphql'

export const getUnitCostTypeLabel = (unitCostType: UnitCostTypeEnum) => {
  return {
    [UnitCostTypeEnum.HOURLY]: 'Pe oră',
    [UnitCostTypeEnum.FIXED]: 'Fix',
  }[unitCostType]
}

export const getCategoryLabelFromCode = (code: string) => {
  return {
    hr: 'Resurse Umane',
    accounting: 'Contabilitate',
  }[code]
}
