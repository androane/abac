import { UnitCostTypeEnum } from 'generated/graphql'

export const getUnitCostTypeLabel = (unitCostType: UnitCostTypeEnum) => {
  return {
    [UnitCostTypeEnum.HOURLY]: 'Pe oră',
    [UnitCostTypeEnum.FIXED]: 'Fix',
  }[unitCostType]
}

export const CATEGORY_CODE_TO_LABEL = {
  hr: 'Resurse Umane',
  accounting: 'Contabilitate',
}
