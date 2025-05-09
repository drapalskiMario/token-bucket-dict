const getKeyType = (key: string) => {
  if (/^[0-9]{11}$/.test(key)) return 'CPF'
  if (/^[0-9]{14}$/.test(key)) return 'CNPJ'
  if (/^\+[1-9]\d{1,14}$/.test(key)) return 'PHONE'
  if (/^[a-z0-9.!#$&'*+\/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/.test(key))
    return 'EMAIL'
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(key)) return 'EVP'
  return null
}

const getUserType = (userId: string) => {
  if (/^[0-9]{11}$/.test(userId)) return 'CPF'
  if (/^[0-9]{14}$/.test(userId)) return 'CNPJ'
  return null
}

export default { getKeyType, getUserType }
