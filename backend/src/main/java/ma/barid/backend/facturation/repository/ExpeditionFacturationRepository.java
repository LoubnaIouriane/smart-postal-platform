package ma.barid.backend.facturation.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class ExpeditionFacturationRepository {

    private final JdbcTemplate jdbcTemplate;

    public ExpeditionFacturationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<FacturableExpedition> findFacturablesByClientAndPeriode(Long clientId, LocalDate debut, LocalDate fin) {
        Optional<String> table = firstExistingTable("expedition", "expeditions");
        if (table.isEmpty()) {
            return List.of();
        }

        Map<String, String> columns = columnsByLowerName(table.get());
        String idColumn = firstExistingColumn(columns, "id_expedition", "idexpedition", "id").orElse(null);
        String clientColumn = firstExistingColumn(columns, "client_id", "id_client", "clientid", "client").orElse(null);
        String dateColumn = firstExistingColumn(columns, "date_creation", "datecreation").orElse(null);
        String coutColumn = firstExistingColumn(columns, "cout_calcule", "coutcalcule", "cout_calculé").orElse(null);

        if (idColumn == null || clientColumn == null || dateColumn == null || coutColumn == null) {
            return List.of();
        }

        String sql = "select * from " + table.get()
                + " where " + clientColumn + " = ?"
                + " and date(" + dateColumn + ") between ? and ?"
                + " and " + coutColumn + " is not null"
                + " order by " + dateColumn + " asc";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            FacturableExpedition expedition = new FacturableExpedition();
            expedition.setIdExpedition(rs.getLong(idColumn));
            expedition.setClientId(clientId);
            expedition.setCodeExpedition(getString(getObject(rs, column(columns, "code_expedition", "codeexpedition"))));
            expedition.setTypeEnvoi(getString(getObject(rs, column(columns, "type_envoi", "typeenvoi"))));
            expedition.setPoidsDeclare(getDouble(getObject(rs, column(columns, "poids_declare", "poidsdeclare", "poids_déclaré"))));
            expedition.setPoidsReel(getDouble(getObject(rs, column(columns, "poids_reel", "poidsreel", "poids_réel"))));
            expedition.setDestinataireNom(getString(getObject(rs, column(columns, "destinataire_nom", "destinatairenom"))));
            expedition.setDestinataireTelephone(getString(getObject(rs, column(columns, "destinataire_telephone", "destinatairetelephone", "destinataire_téléphone"))));
            expedition.setDestinataireAdresse(getString(getObject(rs, column(columns, "destinataire_adresse", "destinataireadresse"))));
            expedition.setDateCreation(getLocalDate(rs.getObject(dateColumn)));
            expedition.setCoutCalcule(getDouble(rs.getObject(coutColumn)));
            expedition.setMotifModificationTarif(getString(getObject(rs, column(columns, "motif_modification_tarif", "motifmodificationtarif"))));
            expedition.setVilleDepartId(getLong(getObject(rs, column(columns, "ville_depart_id", "villedepart_id", "villedepart", "id_ville_depart"))));
            expedition.setVilleDestinationId(getLong(getObject(rs, column(columns, "ville_destination_id", "villedestination_id", "villedestination", "id_ville_destination"))));
            return expedition;
        }, clientId, Date.valueOf(debut), Date.valueOf(fin));
    }

    private Optional<String> firstExistingTable(String... candidates) {
        for (String candidate : candidates) {
            Integer count = jdbcTemplate.queryForObject(
                    "select count(*) from information_schema.tables where table_schema = database() and table_name = ?",
                    Integer.class,
                    candidate
            );
            if (count != null && count > 0) {
                return Optional.of(candidate);
            }
        }
        return Optional.empty();
    }

    private Map<String, String> columnsByLowerName(String table) {
        return jdbcTemplate.query(
                "select column_name from information_schema.columns where table_schema = database() and table_name = ?",
                rs -> {
                    java.util.HashMap<String, String> columns = new java.util.HashMap<>();
                    while (rs.next()) {
                        String name = rs.getString(1);
                        columns.put(name.toLowerCase(), name);
                    }
                    return columns;
                },
                table
        );
    }

    private Optional<String> firstExistingColumn(Map<String, String> columns, String... candidates) {
        for (String candidate : candidates) {
            String column = columns.get(candidate.toLowerCase());
            if (column != null) {
                return Optional.of(column);
            }
        }
        return Optional.empty();
    }

    private String column(Map<String, String> columns, String... candidates) {
        return firstExistingColumn(columns, candidates).orElse(null);
    }

    private Object getObject(java.sql.ResultSet rs, String column) throws java.sql.SQLException {
        return column == null ? null : rs.getObject(column);
    }

    private String getString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private Double getDouble(Object value) {
        return value instanceof Number number ? number.doubleValue() : null;
    }

    private Long getLong(Object value) {
        return value instanceof Number number ? number.longValue() : null;
    }

    private LocalDate getLocalDate(Object value) {
        if (value instanceof Date date) {
            return date.toLocalDate();
        }
        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime().toLocalDate();
        }
        return null;
    }
}
