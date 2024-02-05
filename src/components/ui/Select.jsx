

export default function Select({options,defaultValue, ...props}) {
  return (
    <select {...props} defaultValue={defaultValue}>
        <option value="">All locations</option>
        {options.map(({address}) => (
            <option key={address?.zipcode} value={address?.city}>{address?.city}</option>
        ))}
    </select>
  )
}
