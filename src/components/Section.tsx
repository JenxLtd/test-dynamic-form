import { For, Show } from "solid-js";

export function Section(props: any) {
    return (
        <>
            <Show when={props.type === "Section"}>
                <fieldset>
                    <legend>{props.name}</legend>

                    <For each={props.children}>
                        {child => <Section form={props.form} {...child} />}
                    </For>
                </fieldset>
            </Show>
            <Show when={props.type === "Options"}>
                <fieldset>
                    <legend>{props.name}</legend>

                    <props.form.Field
                        name={props.id}
                        defaultValue={false}
                        validators={{
                            onMount: ({ value }) => {
                                if (
                                    props.type === "Options" &&
                                    typeof value !== "boolean"
                                ) {
                                    return `${props.id} is required`
                                }

                                return undefined
                            },

                        }}
                    >
                        {
                            field => (
                                <For each={props.options}>
                                    {
                                        option => (
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={field().name}
                                                    value={option}
                                                    checked={field().state.value === option}
                                                    on:change={event => {
                                                        field().handleChange(event.currentTarget.value)
                                                    }}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        )
                                    }
                                </For>
                            )
                        }
                    </props.form.Field>
                </fieldset>
            </Show>
        </>
    )
}