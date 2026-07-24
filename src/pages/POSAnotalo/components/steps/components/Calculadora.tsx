import { memo } from "react";
import { Button, Row, Col } from "antd";
import { MdOutlineBackspace } from "react-icons/md";

const btnStyle: React.CSSProperties = {
  height: "64px",
  fontSize: "24px",
  borderRadius: "12px",
  background: "#fff",
  fontWeight: "500",
  border: "1px solid #f0f0f0",
  transition: "all 0.1s",
};

interface CalculadoraProps {
  onPress: (digit: string) => void;
  onPlus?: () => void;
  onClear?: () => void;
  onUndo?: () => void;
  onBackspace: () => void;
  activeColor: string;
  hasValue: boolean;
  height?: string;
  btnTabIndex?: number;
}

const Calculadora = memo(({ onPress, onPlus, onClear, onUndo, onBackspace, activeColor, hasValue, height = "64px", btnTabIndex }: CalculadoraProps) => {
  const numeros = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const mergedBtnStyle: React.CSSProperties = { height, ...btnStyle };

  return (
    <Row gutter={[8, 8]}>
      {numeros.map((btn) => (
        <Col span={8} key={btn}>
          <Button
            block
            tabIndex={btnTabIndex ?? 0}
            style={mergedBtnStyle}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onPress(btn)}
          >
            {btn}
          </Button>
        </Col>
      ))}

      <Col span={8}>
        {onUndo ? (
          <Button
            block
            tabIndex={btnTabIndex ?? 0}
            style={{ ...mergedBtnStyle, fontSize: "13px", fontWeight: 600 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onUndo}
          >
            DESHACER
          </Button>
        ) : (
          <Button
            block
            tabIndex={btnTabIndex ?? 0}
            disabled={!hasValue}
            style={{
              ...mergedBtnStyle,
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onBackspace}
          >
            <MdOutlineBackspace size={22} />
          </Button>
        )}
      </Col>
      <Col span={8}>
        <Button
          block
          tabIndex={btnTabIndex ?? 0}
          style={mergedBtnStyle}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPress("0")}
        >
          0
        </Button>
      </Col>
      <Col span={8}>
        {onClear && !onPlus ? (
          <Button
            block
            tabIndex={btnTabIndex ?? 0}
            style={{
              height,
              borderRadius: "12px",
              fontSize: "24px",
              fontWeight: "700",
              border: `2px solid ${activeColor}`,
              background: activeColor,
              color: "#fff",
              transition: "all 0.15s",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClear}
          >
            C
          </Button>
        ) : (
          <Button
            block
            tabIndex={btnTabIndex ?? 0}
            disabled={!hasValue}
            style={{
              height,
              borderRadius: "12px",
              fontSize: "24px",
              fontWeight: "700",
              border: hasValue ? `2px solid ${activeColor}` : "1px solid #e8e8e8",
              background: hasValue ? activeColor : "#f5f5f5",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1.2,
              gap: 0,
              transition: "all 0.15s",
              cursor: hasValue ? "pointer" : "default",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onPlus}
          >
            <span style={{ fontSize: "22px", lineHeight: 1 }}>+</span>
            <span style={{ fontSize: "9px", fontWeight: 600, opacity: 0.9, lineHeight: 1 }}>AGREGAR</span>
          </Button>
        )}
      </Col>
    </Row>
  );
});

Calculadora.displayName = "Calculadora";

export default Calculadora;
