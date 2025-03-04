import {CInput} from "@/components/ui/CInput";
import {CButton} from "@/components/ui/CButton";
import {CModal} from "@/components/ui/CModal";
import React, {useMemo, useState} from "react";
import {Alert, StyleSheet} from "react-native";
import {useTrains} from "@/hooks/useTrains";

interface Props {
    visible: boolean;
    onHide: () => void;
}

export function LoadBackupModal(props: Props) {
    const trains = useTrains();
    const [backupValue, setBackupValue] = useState('')

    const disabled = useMemo(() => backupValue.trim().length === 0, [backupValue])

    async function load() {
        if (disabled) {
            return;
        }

        try {
            await trains.loadBackup(JSON.parse(atob(backupValue)))
            props.onHide();
            setBackupValue('');
        } catch (error) {
            Alert.alert("Ошибка", JSON.stringify(error));
        }
    }

    return (
        <CModal style={modalStyle.modal} visible={props.visible} onHide={props.onHide}>
            <CInput style={modalStyle.input} placeholder={'Вставьте бекап'} value={backupValue}
                    onInput={setBackupValue}/>

            <CButton disabled={disabled} onPress={load}>Загрузить</CButton>
        </CModal>
    )

}

const modalStyle = StyleSheet.create({
    modal: {
        flex: 0
    },
    input: {
        width: '100%',
        marginBottom: 10
    }
})