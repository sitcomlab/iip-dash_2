/**
 * Smart City Münster Dashboard
 * Copyright (C) 2022 Reedu GmbH & Co. KG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function addInfo(feature, layer) {
    let heading;
    // Handle bikeability data
    if (feature.properties?.factor_score !== undefined) {
        heading = "<p style='text-align:center; font-size:150%; font-weight:bold;'> Bikeability </p>";
        const score = Math.round(feature.properties.factor_score * 1000) / 1000;

        const html = heading + 
            "<table class='table is-striped is-narrow' style='font-size: 14px;'>" +
            "<tbody>" +
            `<tr><td style='font-size: 15px;'>Index Value : </td><td style='font-size: 15px;'> ${score}</td></tr>` +
            "</tbody></table>";
        layer.bindPopup(html);
        return;
    }
    
    const bIType = feature.properties.bike_infrastructure_type;
    heading = "<p style='text-align:center; font-size:150%; font-weight:bold;'> " +
        bIType +
        ' </p>';
    // Create table if attributes are filled
    if (feature.properties?.attributes?.length > 0) {
      const attributes = feature.properties.attributes;
      let html_table =
        heading +
        "<table class='table is-striped is-narrow' style='font-size: 15px;'> <tbody> <tr> <th style='font-size: 15px;'> Weitere Infos </th> <th style='font-size: 15px;'> </th> <tr>";
      // loop through the dictionary to feed the table with rows
      attributes.forEach((attr) => {
        for (const key in attr) {
          const value = attr[key];
          const tr = ' <tr> <td style="font-size: 14px;"> ' + key + '</td> <td style="font-size: 14px;"> ' + value + '</td> </tr>';
          html_table = html_table + tr;
        }
      });
      // close the table
      html_table = html_table + ' </tbody> </table>';
      layer.bindPopup(html_table);
    } else if (feature.properties?.attributes.length === 0) {
      layer.bindPopup(heading);
    }
}
  
export {addInfo}
